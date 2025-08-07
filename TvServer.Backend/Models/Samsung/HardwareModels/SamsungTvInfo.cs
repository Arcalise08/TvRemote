using System.Text.Json;

namespace TvServer.Models.Samsung.HardwareModels;

public class SamsungTvInfo
{
    public SamsungAdditionalDeviceInfo? Device { get; set; }
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