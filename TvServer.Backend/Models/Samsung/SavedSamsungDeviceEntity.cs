using System.ComponentModel.DataAnnotations;
using TvServer.Models.Samsung.Events;
using TvServer.Models.Samsung.HardwareModels;

namespace TvServer.Models.Samsung;

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
    [MaxLength(255)]
    public string? Token { get; set; }
    public DeviceStatus Status { get; set; }
    public List<SamsungAppData>? SamsungApps { get; set; }
    public SamsungTvInfo? DeviceInfo { get; set; }
}
