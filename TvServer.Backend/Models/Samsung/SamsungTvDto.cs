using System.ComponentModel.DataAnnotations;
using TvServer.Models.Samsung.Events;
using TvServer.Models.Samsung.HardwareModels;

namespace TvServer.Models.Samsung;

public class SamsungTvDto
{
    [Required]
    public required string Id { get; set; }
    [Required]
    public required string DeviceName { get; set; }
    public string? LastKnownIp { get; set; }
    public DeviceStatus Status { get; set; }
    public List<SamsungAppData>? SamsungApps { get; set; }
    public SamsungTvInfo? DeviceInfo { get; set; }
}