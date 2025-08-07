using TvServer.Models;
using TvServer.Models.Roku;
using TvServer.Models.Samsung;

namespace TvServer.Extensions;

public static class DtoExtensions
{
    public static RokuTvDto ToDto(this SavedRokuDeviceEntity entity)
    {
        return new RokuTvDto
        {
            Id = entity.Id,
            DeviceName = entity.DeviceName,
            LastKnownIp = entity.LastKnownIp,
            RokuApps = entity.RokuApps,
            Status = entity.Status
        };
    }

    public static SamsungTvDto ToDto(this SavedSamsungDeviceEntity entity)
    {
        return new SamsungTvDto
        {
            Id = entity.Id,
            DeviceName = entity.DeviceName,
            LastKnownIp = entity.LastKnownIp,
            SamsungApps = entity.SamsungApps,
            DeviceInfo = entity.DeviceInfo,
            Status = entity.Status
        };
    }
}