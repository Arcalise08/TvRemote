using TvServerV2.Models;
using TvServerV2.Models.Roku;
using TvServerV2.Models.Samsung;
using TvServerV2.Models.Samsung.HardwareModels;

namespace TvServerV2.Extensions;

public static class DtoExtensions
{
    public static RokuTvDto ToDto(this SavedRokuDeviceEntity entity, DeviceStatus status)
    {
        return new RokuTvDto
        {
            Id = entity.Id,
            DeviceName = entity.DeviceName,
            LastKnownIp = entity.LastKnownIp,
            RokuApps = entity.RokuApps,
            Status = status
        };
    }

    public static SamsungTvDto ToDto(this SavedSamsungDeviceEntity entity, DeviceStatus status)
    {
        return new SamsungTvDto
        {
            Id = entity.Id,
            DeviceName = entity.DeviceName,
            LastKnownIp = entity.LastKnownIp,
            SamsungApps = entity.SamsungApps,
            DeviceInfo = entity.DeviceInfo,
            Status = status
        };
    }
}