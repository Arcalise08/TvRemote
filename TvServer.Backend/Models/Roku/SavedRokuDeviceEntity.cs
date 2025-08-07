using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using TvServer.Models.Roku.HardwareModels;

namespace TvServer.Models.Roku;

public class SavedRokuDeviceEntity
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
    public RokuApps? RokuApps { get; set; }
    public RokuDeviceInfo? DeviceInfo { get; set; }
    public DeviceStatus Status { get; set; }


}
