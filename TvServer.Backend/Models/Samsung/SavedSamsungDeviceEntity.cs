using System.ComponentModel.DataAnnotations;
using TvServerV2.Models.Samsung.Events;
using TvServerV2.Models.Samsung.HardwareModels;

namespace TvServerV2.Models.Samsung;

public class SavedSamsungDeviceEntity
{
    [Required]
    [MaxLength(255)]
    public required string Id { get; set; }
    [Required]
    [MaxLength(255)]
    public required string DeviceName { get; set; }
    [Required]
    [MaxLength(100)]
    public required string LastKnownIp { get; set; }
    public List<SamsungAppData>? SamsungApps { get; set; }
    public SamsungTvInfo? DeviceInfo { get; set; }
}
