using System.Net.WebSockets;
using System.Text.Json;
using TvServer.Models;
using TvServer.Models.Samsung;
using TvServer.Models.Samsung.Events;
using Websocket.Client;

namespace TvServer.Services;

public record SavedSamsungClient(string Ip, WebsocketClient Client);
public class SamsungDirectService(IHttpClientFactory httpClientFactory, Settings settings)
{
    private static readonly List<SavedSamsungClient> Clients = new();
    public List<string> DiscoverSamsungDevices()
    {
        var multiCastService = new MultiCastService();
        var samsungPossibleDevices = multiCastService.DiscoverDevices("ssdp:all")
            .Where(x => x.RawResponse.ToLower().Contains("samsung"));
        var result = new List<string>();
        foreach (var samsungDevice in samsungPossibleDevices)
        {
            if (Uri.TryCreate(samsungDevice.Location, UriKind.Absolute, out Uri uri))
            {
                var host = uri.Host;
                if (!result.Contains(host))
                    result.Add(host);
            }
        }

        return result;
    }
    public List<string> GetConnectedSamsungDevices()
    {
        return Clients.Select(x => x.Ip).ToList();
    }

    public List<string> GetSavedSamsungDevices()
    {
        return settings.SamsungTvProfiles.Select(x => x.Ip).ToList();
    }

    public async Task<SamsungTvInfo?> GetDeviceInfo(string ip)
    {
        string url = $"https://{ip}:8002/api/v2/";
        var client = httpClientFactory.CreateClient("no-ssl");
        var response = await client.GetAsync(url);
        var stringy = await response.Content.ReadAsStringAsync();
        return SamsungTvInfo.Parse(stringy);
    }

    private async Task<SavedSamsungClient?> ConnectToDevice(string ip)
    {
        try
        {
            if (Clients.Any(x => x.Ip == ip))
                return Clients.First(x => x.Ip == ip);
            var profile = settings.SamsungTvProfiles.FirstOrDefault(x => x.Ip == ip);
            var url = $"wss://{ip}:8002/api/v2/channels/samsung.remote.control";
            if (profile is not null)
                url += $"?token={profile.Token}";
            var factory = new Func<ClientWebSocket>(() => new ClientWebSocket
            {
                Options =
                {
                    KeepAliveInterval = TimeSpan.FromSeconds(5),
                    RemoteCertificateValidationCallback = (m, c, ch, e) => true

                }
            });
            var client = new WebsocketClient(new Uri(url), factory);
            client.MessageReceived.Subscribe(msg => _ = HandleMessageRecieved(ip, msg));
            await client.Start();
            var savedSamsungClient = new SavedSamsungClient(ip, client);
            Clients.Add(savedSamsungClient);
            return savedSamsungClient;
        }
        catch (Exception ex)
        {
            return null;
        }

    }
    public async Task HandleMessageRecieved(string ip, ResponseMessage message)
    {
        try
        { 
            var json = message.Text;
            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;
            if (root.TryGetProperty("event", out JsonElement eventElement))
            {
                if (eventElement.GetString() == "ms.channel.connect")
                {
                    var connectEvent = JsonSerializer.Deserialize<SamsungConnectEvent>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (connectEvent is null || string.IsNullOrWhiteSpace(connectEvent.Data.Token))
                        return;
                    var profile = settings.SamsungTvProfiles.FirstOrDefault(x => x.Ip == ip);
                    if (profile is not null)
                    {
                        var index = settings.SamsungTvProfiles.IndexOf(profile);
                        profile.Token = connectEvent.Data.Token;
                        settings.SamsungTvProfiles[index] = profile;
                    }
                    else
                    {
                        settings.SamsungTvProfiles.Add(new SamsungTvProfile()
                        {
                            Ip = ip,
                            Token = connectEvent.Data.Token,
                        });
                    }
                    await settings.SaveSettings();
                }
                if (eventElement.GetString() == "ed.installedApp.get")
                {
                    var installedAppsEvents = JsonSerializer.Deserialize<SamsungInstalledAppsEvent>(json,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
        }
    }
    public async Task<bool> SendKeyPress(string ip, SamsungKeypress keypress, SamsungKeypressType type)
    {
        var client = Clients.FirstOrDefault(x => x.Ip == ip);
        if (client is null)
        {
            client = await ConnectToDevice(ip);
            if (client is null)
                return false;
        }
        var commandTxt = $@"
{{
    ""method"": ""ms.remote.control"",
    ""params"": {{
        ""Cmd"": ""{type}"",
        ""DataOfCmd"": ""{keypress}"",
        ""Option"": ""false"",
        ""TypeOfRemote"": ""SendRemoteKey""
    }}
}}";
        
        client.Client.Send(commandTxt);
        return true;
    }
    public async Task<bool> GetInstalledApps(string ip)
    {
        var client = Clients.FirstOrDefault(x => x.Ip == ip);
        if (client is null)
        {
            client = await ConnectToDevice(ip);
            if (client is null)
                return false;
        }
        var commandTxt = $@"
{{
    ""method"": ""ms.channel.emit"",
    ""params"": {{
        ""event"": ""ed.installedApp.get"",
        ""to"": ""host""
    }}
}}";
        
        client.Client.Send(commandTxt);
        return true;
    }
    public async Task<bool> LaunchApp(string ip, string? appId = null)
    {
        string url = $"https://{ip}:8002/api/v2/applications/{appId}";
        var client = httpClientFactory.CreateClient("no-ssl");
        var response = await client.PostAsync(url, null);
        var stringy = await response.Content.ReadAsStringAsync();
        return true;
    }
}