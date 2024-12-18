using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Xml.Serialization;
using Makaretu.Dns;
using TvServer.Models;

namespace TvServer.Services;

public class RokuService(IHttpClientFactory httpClientFactory)
{
    private const string SsdpAddress = "239.255.255.250";
    private const int SsdpPort = 1900;
    public List<string> DiscoverRokuDevices()
    {

        List<string> deviceLocations = new();
        string ssdpRequest = 
            "M-SEARCH * HTTP/1.1\r\n" +
            "HOST: 239.255.255.250:1900\r\n" +
            "MAN: \"ssdp:discover\"\r\n" +
            "MX: 3\r\n" +
            "ST: roku:ecp\r\n\r\n";


        using UdpClient client = new UdpClient();
        client.EnableBroadcast = true;
        IPEndPoint localEndPoint = new IPEndPoint(IPAddress.Any, 0);
        client.Client.Bind(localEndPoint);

        byte[] requestBytes = Encoding.UTF8.GetBytes(ssdpRequest);
        IPEndPoint ssdpEndPoint = new IPEndPoint(IPAddress.Parse(SsdpAddress), SsdpPort);
        client.Send(requestBytes, requestBytes.Length, ssdpEndPoint);

        var timeout = DateTime.Now.AddSeconds(5);
        while (DateTime.Now < timeout)
        {
            if (client.Available > 0)
            {
                IPEndPoint remoteEndPoint = null;
                byte[] responseBytes = client.Receive(ref remoteEndPoint);
                string response = Encoding.UTF8.GetString(responseBytes);

                if (response.Contains("LOCATION:"))
                {
                    var locationLine = response.Split("\r\n")
                        .FirstOrDefault(line => line.StartsWith("LOCATION:", StringComparison.OrdinalIgnoreCase));
                    if (locationLine != null)
                    {
                        string location = locationLine.Split(":", 2)[1].Trim();
                        deviceLocations.Add(location);
                    }
                }
            }
            
        }

        return deviceLocations;
    }

    public async Task<RokuDeviceInfo> GetDeviceInfo(string ip)
    {
        if (!ip.EndsWith("/"))
        {
            ip += "/";
        }
        var client = httpClientFactory.CreateClient();
        var response = await client.GetAsync(ip + "query/device-info");
        var stringy = await response.Content.ReadAsStringAsync();
        return RokuDeviceInfo.ParseDeviceInfo(stringy);
    }
    
    public async Task<RokuApps> GetInstalledApps(string ip)
    {
        if (!ip.EndsWith("/"))
        {
            ip += "/";
        }
        var client = httpClientFactory.CreateClient();
        var response = await client.GetAsync(ip + "query/apps");
        var stringy = await response.Content.ReadAsStringAsync();
        
        var serializer = new XmlSerializer(typeof(RokuApps));
        using var reader = new StringReader(stringy);
        return (RokuApps)serializer.Deserialize(reader);
    }
    
    public async Task<bool> SendKeyPress(string ip, RokuKeypress keypress, string? additionalData = null)
    {
        if (!ip.EndsWith("/"))
        {
            ip += "/";
        }
        var url = ip + ParseKeypress(keypress, additionalData);
        var client = httpClientFactory.CreateClient();
        var response = await client.PostAsync(url, null);
        return response.IsSuccessStatusCode;
    }
    public async Task<byte[]> GetAppIconAsync(string ip, string appId)
    {
        if (!ip.EndsWith("/"))
            ip += "/";

        string url = ip + $"query/icon/{appId}";
        var client = httpClientFactory.CreateClient();
        var response = await client.GetAsync(url);
        if (!response.IsSuccessStatusCode)
            throw new HttpRequestException($"Failed to retrieve app icon. Status: {response.StatusCode}");
        return await response.Content.ReadAsByteArrayAsync();
    }
    
    private string ParseKeypress(RokuKeypress keypress, string? additionalData = null)
    {
        switch (keypress)
        {
            case RokuKeypress.Lit:
                if (string.IsNullOrEmpty(additionalData))
                    throw new ArgumentException("Additional data required for 'Lit' keypress.");
                return $"Lit_{additionalData}";

            case RokuKeypress.Launch:
                if (string.IsNullOrEmpty(additionalData))
                    throw new ArgumentException("Additional data required for 'Launch' keypress.");
                return $"launch/{additionalData}";

            default:
                return "keypress/" + keypress;
        }
    }
}