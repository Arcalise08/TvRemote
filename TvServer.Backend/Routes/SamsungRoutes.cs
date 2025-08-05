using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using TvServerV2.Extensions;
using TvServerV2.Models;
using TvServerV2.Models.Samsung;
using TvServerV2.Models.Samsung.HardwareModels;
using TvServerV2.Services;

namespace TvServerV2.Routes;

public static class SamsungRoutes
{
    public static WebApplication MapSamsungRoutes(this WebApplication app)
    {
        app.MapGet("/api/samsung/devices", async (
                [FromServices] SamsungDirectService service,
                [FromServices] MulticastBackgroundService multicastService,
                [FromServices] AppDbContext db,
                [FromServices] IMemoryCache cache,
                CancellationToken ct) =>
            {
                var savedDevices = await db.SamsungDevices
                    .Select(x => x.ToDto(DeviceStatus.Unknown))
                    .ToListAsync(ct);
                return Results.Ok(savedDevices);
            }).WithTags("Samsung Devices")
            .Produces<List<SamsungTvDto>>(200, "application/json");


        app.MapPost("/api/samsung/devices/info", async (
                SamsungDeviceRequest req,
                [FromServices] SamsungDirectService service,
                [FromServices] AppDbContext db,
                [FromServices] IMemoryCache cache,
                CancellationToken ct) =>
            {

                var savedDevice = await db.SamsungDevices
                    .Include(x => x.SamsungApps)
                    .Include(savedSamsungDeviceEntity => savedSamsungDeviceEntity.DeviceInfo)
                    .FirstOrDefaultAsync(x => x.Id == req.DeviceId,
                        cancellationToken: ct);
                if (savedDevice is null)
                    return Results.NotFound();
                cache.Set(savedDevice.Id, savedDevice.LastKnownIp);
                bool online = false;
                SamsungTvInfo? info = null;
                try
                {
                    info = await service.GetDeviceInfo(savedDevice.LastKnownIp);
                }
                catch (Exception e) {}
                if (info == null)
                    return Results.Ok(savedDevice.ToDto(DeviceStatus.Offline));
                
                if (!string.IsNullOrWhiteSpace(info.Name))
                    savedDevice.DeviceName = info.Name;
                if (savedDevice.DeviceInfo is null)
                {
                    info.Id = Guid.NewGuid().ToString();
                    if (info.Device is not null)
                        info.Device.Id = Guid.NewGuid().ToString();
                    savedDevice.DeviceInfo = info;
                    db.Entry(savedDevice.DeviceInfo).State = EntityState.Added;
                }
                else
                {
                    info.Id = savedDevice.DeviceInfo.Id;
                    if (info.Device is not null)
                        info.Device.Id = savedDevice.DeviceInfo.Id;
                    
                    db.Entry(savedDevice.DeviceInfo).CurrentValues.SetValues(info);
                    if (info.Device != null)
                    {
                        if (savedDevice.DeviceInfo.Device == null)
                        {
                            info.Device.Id = Guid.NewGuid().ToString();
                            savedDevice.DeviceInfo.Device = info.Device;
                            db.Entry(savedDevice.DeviceInfo.Device).State = EntityState.Added;
                        }
                        else
                        {
                            db.Entry(savedDevice.DeviceInfo.Device).CurrentValues.SetValues(info.Device);
                        }
                    }
                }
                await db.SaveChangesAsync(ct);
                return Results.Ok(savedDevice.ToDto(DeviceStatus.Online));
            }).WithTags("Samsung Devices")
            .Produces<SamsungTvDto>(200, "application/json");


        app.MapPost("/api/samsung/devices/keyPress", async (
                SamsungKeypressRequest req,
                [FromServices] SamsungDirectService service,
                [FromServices] AppDbContext db,
                [FromServices] IMemoryCache cache,
                CancellationToken ct) =>
            {
                var ip = await GetDeviceIpAsync(cache, db, req.deviceId);
                if (string.IsNullOrWhiteSpace(ip))
                    return Results.NotFound("Device not found.");
                var info = await service.SendKeyPress(ip, req.Keypress, req.Type);
                return Results.Ok(info);
            }).WithTags("Samsung Devices")
            .Produces<bool>(200, "plain/text");


        app.MapPost("/api/samsung/devices/launchApp", async (
                SamsungLaunchAppRequest req,
                [FromServices] SamsungDirectService service,
                [FromServices] AppDbContext db,
                [FromServices] IMemoryCache cache,
                CancellationToken ct) =>
            {
                var ip = await GetDeviceIpAsync(cache, db, req.DeviceId);
                if (string.IsNullOrWhiteSpace(ip))
                    return Results.NotFound("Device not found.");
                var info = await service.LaunchApp(ip, req.AppId);
                return Results.Ok(info);
            }).WithTags("Samsung Devices")
            .Produces<bool>(200, "plain/text");

        app.MapGet("/api/samsung/devices/apps",
                async ([FromQuery] string deviceId,
                    [FromServices] SamsungDirectService service,
                    [FromServices] AppDbContext db,
                    [FromServices] IMemoryCache cache,
                    CancellationToken ct) =>
                {
                    var ip = await GetDeviceIpAsync(cache, db, deviceId);
                    if (string.IsNullOrWhiteSpace(ip))
                        return Results.NotFound("Device not found.");
                    var info = await service.GetInstalledApps(ip);
                    return Results.Ok(info);
                }).WithTags("Samsung Devices")
            .Produces<bool>(200, "plain/text");

        app.MapDelete("/api/samsung/devices", async (
                [FromQuery] string id,
                [FromServices] MulticastBackgroundService multicastService,
                [FromServices] AppDbContext db,
                CancellationToken ct) =>
            {
                if (string.IsNullOrWhiteSpace(id))
                    return Results.BadRequest("Id is required.");
                var device = await db.SamsungDevices
                    .FirstOrDefaultAsync(x => x.Id == id, cancellationToken: ct);
                if (device == null)
                    return Results.NotFound("Device not found.");
                db.SamsungDevices.Remove(device);
                await db.SaveChangesAsync(ct);
                return Results.Ok("Device removed successfully.");
            }).WithTags("Samsung Devices")
            .Produces<bool>(200, "plain/text");
        
        return app;
    }

    private static async Task<string?> GetDeviceIpAsync(IMemoryCache cache, AppDbContext db, string deviceId)
    {
        var ip = cache.Get<string>(deviceId);
        if (!string.IsNullOrWhiteSpace(ip))
            return ip;
        var savedDevice = await db.SamsungDevices
            .FirstOrDefaultAsync(x => x.Id == deviceId);
        if (savedDevice is null)
            return null;
        ip = savedDevice.LastKnownIp;
        if (string.IsNullOrWhiteSpace(ip))
            return null;
        cache.Set(savedDevice.Id, ip);
        return ip;
    }
}