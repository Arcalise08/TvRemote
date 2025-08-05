using System.Xml.Serialization;
using TvServerV2.Models;
using TvServerV2.Models.Roku;
using TvServerV2.Models.Roku.HardwareModels;

namespace TvServerV2.Services;

public class RokuService(
    IHttpClientFactory httpClientFactory)
{

    public async Task<RokuDeviceInfo?> GetDeviceInfo(string ip)
    {
        try
        {
            if (!ip.EndsWith("/"))
            {
                ip += "/";
            }
            if (!ip.StartsWith("http://"))
                ip = "http://" + ip;
            var client = httpClientFactory.CreateClient("default");
            var response = await client.GetAsync(ip + "query/device-info");
            var stringy = await response.Content.ReadAsStringAsync();
            return RokuDeviceInfo.Parse(stringy);
        }
        catch
        {
            return null;
        }
    }
    
    public async Task<RokuApps> GetInstalledApps(string ip)
    {
        if (!ip.EndsWith("/"))
        {
            ip += "/";
        }
        var client = httpClientFactory.CreateClient("default");
        var response = await client.GetAsync(ip + "query/apps");
        var stringy = await response.Content.ReadAsStringAsync();
        
        var serializer = new XmlSerializer(typeof(RokuApps));
        using var reader = new StringReader(stringy);
        return (RokuApps)serializer.Deserialize(reader)!;
    }
    
    public async Task<bool> SendKeyPress(string ip, RokuKeypress keypress, string? additionalData = null)
    {
        if (!ip.EndsWith("/"))
        {
            ip += "/";
        }
        var url = ip + ParseKeypress(keypress, additionalData);
        var client = httpClientFactory.CreateClient("default");
        var response = await client.PostAsync(url, null);
        return response.IsSuccessStatusCode;
    }
    public async Task<byte[]> GetAppIconAsync(string ip, string appId)
    {
        if (!ip.EndsWith("/"))
            ip += "/";

        string url = ip + $"query/icon/{appId}";
        var client = httpClientFactory.CreateClient("default");
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