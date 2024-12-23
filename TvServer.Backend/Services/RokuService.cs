using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Xml.Serialization;
using Makaretu.Dns;
using TvServer.Models;

namespace TvServer.Services;

public class RokuService(IHttpClientFactory httpClientFactory)
{
    
    public List<string> DiscoverRokuDevices()
    {
        var multiCastService = new MultiCastService();
        return multiCastService.DiscoverDevices("roku:ecp")
            .Select(x => x.Location)
            .ToList();
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
        return RokuDeviceInfo.Parse(stringy);
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