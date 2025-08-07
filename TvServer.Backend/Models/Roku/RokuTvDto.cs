using System.ComponentModel.DataAnnotations;
using TvServer.Models.Roku.HardwareModels;

namespace TvServer.Models.Roku;

public class RokuTvDto
{
    [Required]
    public required string Id { get; set; }
    [Required]
    public required string DeviceName { get; set; }
    public string? LastKnownIp { get; set; }
    public DeviceStatus Status { get; set; }
    public RokuApps? RokuApps { get; set; }
    public RokuDeviceInfo? RokuDeviceInfo { get; set; }
}