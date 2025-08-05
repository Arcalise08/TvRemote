using System.ComponentModel.DataAnnotations;
using TvServerV2.Models.Samsung.Events;
using TvServerV2.Models.Samsung.HardwareModels;

namespace TvServerV2.Models.Samsung;

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