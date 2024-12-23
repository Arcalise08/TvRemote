using System.Text.Json;

namespace TvServer.Models;

public class DeviceInfo
{
    public string? FrameTVSupport { get; set; }
    public string? GamePadSupport { get; set; }
    public string? ImeSyncedSupport { get; set; }
    public string? Language { get; set; }
    public string? OS { get; set; }
    public string? PowerState { get; set; }
    public string? TokenAuthSupport { get; set; }
    public string? VoiceSupport { get; set; }
    public string? WallScreenRatio { get; set; }
    public string? WallService { get; set; }
    public string? CountryCode { get; set; }
    public string? Description { get; set; }
    public string? DeveloperIP { get; set; }
    public string? DeveloperMode { get; set; }
    public string? Duid { get; set; }
    public string? FirmwareVersion { get; set; }
    public string? Id { get; set; }
    public string? Ip { get; set; }
    public string? Model { get; set; }
    public string? ModelName { get; set; }
    public string? Name { get; set; }
    public string? NetworkType { get; set; }
    public string? Resolution { get; set; }
    public string? SmartHubAgreement { get; set; }
    public string? Ssid { get; set; }
    public string? Type { get; set; }
    public string? Udn { get; set; }
    public string? WifiMac { get; set; }
}

public class SamsungTvInfo
{
    public DeviceInfo? Device { get; set; }
    public string? Id { get; set; }
    public string? IsSupport { get; set; }
    public string? Name { get; set; }
    public string? Remote { get; set; }
    public string? Type { get; set; }
    public string? Uri { get; set; }
    public string? Version { get; set; }

    public static SamsungTvInfo? Parse(string json)
    {
        return JsonSerializer.Deserialize<SamsungTvInfo>(json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }
}
