using System.Net.WebSockets;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using TvServer.Models;
using TvServer.Models.Samsung.Events;
using TvServer.Models.Samsung.HardwareModels;
using Websocket.Client;

namespace TvServer.Services;

public record SavedSamsungClient(string DeviceId, string Ip, WebsocketClient Client);
public class SamsungDirectService(
    IHttpClientFactory httpClientFactory,
    IServiceProvider provider)
{
    private static readonly List<SavedSamsungClient> Clients = new();
    
    public async Task<SamsungTvInfo?> GetDeviceInfo(string ip)
    {
        try
        {
            string url = $"https://{ip}:8002/api/v2/";
            var client = httpClientFactory.CreateClient("no-ssl");
            var response = await client.GetAsync(url);
            var stringy = await response.Content.ReadAsStringAsync();
            return SamsungTvInfo.Parse(stringy);
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    private async Task<SavedSamsungClient?> ConnectToDevice(string ip)
    {
        try
        {
            var savedClient = Clients.FirstOrDefault(x => x.Ip == ip);
            if (savedClient is not null)
                return savedClient;
            using var scope = provider.CreateScope();
            var cache = scope.ServiceProvider.GetRequiredService<IMemoryCache>();
            var cachedTv = cache.Get<CachedDevice>(ip);
            if (cachedTv is null || cachedTv?.Token is null)
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var savedTv = await db.SamsungDevices
                    .FirstOrDefaultAsync(x => x.LastKnownIp == ip);
                if (savedTv is not null)
                {
                    cachedTv = new CachedDevice(savedTv.Id, savedTv.LastKnownIp, savedTv.Token);
                    cache.Set(ip, cachedTv);
                }
            }
            
            if (cachedTv is null) 
                return null;
            var name = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("Kyles Super Awesome Remote"));
            var url = $"wss://{cachedTv.IpAddress}:8002/api/v2/channels/samsung.remote.control?name={name}&token={cachedTv.Token}";
            var factory = new Func<ClientWebSocket>(() => new ClientWebSocket
            {
                Options =
                {
                    KeepAliveInterval = TimeSpan.FromSeconds(10),
                    RemoteCertificateValidationCallback = (m, c, ch, e) => true
                }
            });
            var client = new WebsocketClient(new Uri(url), factory)
            {
                ReconnectTimeout = null
            };
            await client.Start();
            client.MessageReceived.Subscribe(
                async o => await HandleMessageRecieved(cachedTv.Id, o));
            var savedSamsungClient = new SavedSamsungClient(cachedTv.Id, cachedTv.IpAddress, client);
            Clients.Add(savedSamsungClient);
            return savedSamsungClient;
        }
        catch (Exception ex)
        {
            return null;
        }

    }
    public async Task HandleMessageRecieved(string deviceId, ResponseMessage message)
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
                    using var scope = provider.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    var tv = await db.SamsungDevices
                        .FirstOrDefaultAsync(x => x.Id == deviceId);
                    if (tv is null) return;
                    if (tv.Token is not null) return;

                    tv.Token = connectEvent.Data.Token;
                    await db.SaveChangesAsync();
                }
                if (eventElement.GetString() == "ed.installedApp.get")
                {
                    var installedAppsEvents = JsonSerializer.Deserialize<SamsungInstalledAppsEvent>(json,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (installedAppsEvents is null) return;
                    using var scope = provider.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    var tv = await db.SamsungDevices
                        .FirstOrDefaultAsync(x => x.Id == deviceId);
                    if (tv is null) return;
                    tv.SamsungApps = installedAppsEvents.Data.Data;
                    await db.SaveChangesAsync();
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
        }
    }
    public async Task<bool> SendKeyPress(string ipAddr, SamsungKeypress keypress, SamsungKeypressType type)
    {
        var client = Clients.FirstOrDefault(x => x.Ip == ipAddr);
        if (client is null)
        {
            client = await ConnectToDevice(ipAddr);
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
    public async Task<bool> GetInstalledApps(string ipAddr)
    {
        var client = Clients.FirstOrDefault(x => x.Ip == ipAddr);
        if (client is null)
        {
            client = await ConnectToDevice(ipAddr);
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
        var url = $"https://{ip}:8002/api/v2/applications/{appId}";
        var client = httpClientFactory.CreateClient("no-ssl");
        var response = await client.PostAsync(url, null);
        var stringy = await response.Content.ReadAsStringAsync();
        return true;
    }
}