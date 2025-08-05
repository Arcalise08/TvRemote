using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using TvServerV2.Extensions;
using TvServerV2.Models;
using TvServerV2.Models.Roku;
using TvServerV2.Models.Roku.HardwareModels;
using TvServerV2.Services;

namespace TvServerV2.Routes;

public static class RokuRoutes
{
    public static WebApplication MapRokuRoutes(this WebApplication app)
    {
        app.MapGet("/api/roku/devices", async (
                [FromServices] RokuService service,
                [FromServices] MulticastBackgroundService multicastService,
                [FromServices] AppDbContext db,
                [FromServices] IMemoryCache cache,
                CancellationToken ct) =>
            {
                var savedDevices = await db.RokuDevices
                    .Select(x => x.ToDto(DeviceStatus.Unknown))
                    .ToListAsync(ct);
                return Results.Ok(savedDevices);
            }).WithTags("Roku Devices")
            .Produces<List<RokuTvDto>>(200, "application/json");


        app.MapPost("/api/roku/devices/info", async (
                RokuDeviceRequest req,
                [FromServices] RokuService service,
                [FromServices] AppDbContext db,
                [FromServices] IMemoryCache cache,
                CancellationToken ct) =>
            {
                var savedDevice = await db.RokuDevices
                    .Include(x => x.RokuApps)
                    .Include(savedRokuDeviceEntity => savedRokuDeviceEntity.DeviceInfo)
                    .FirstOrDefaultAsync(x => x.Id == req.DeviceId,
                        cancellationToken: ct);
                if (savedDevice is null)
                    return Results.NotFound();
                cache.Set(savedDevice.Id, savedDevice.LastKnownIp);
                var info = await service.GetDeviceInfo(savedDevice.LastKnownIp);
                if (info == null)
                    return Results.Ok(savedDevice.ToDto(DeviceStatus.Offline));
                if (!string.IsNullOrWhiteSpace(info.FriendlyDeviceName))
                    savedDevice.DeviceName = info.FriendlyDeviceName;
                if (savedDevice.DeviceInfo is null)
                    info = info with { Id = Guid.NewGuid().ToString() };
                else
                    info = info with { Id = savedDevice.DeviceInfo.Id };
                savedDevice.DeviceInfo = info;
                await db.SaveChangesAsync(ct);
                return Results.Ok(savedDevice.ToDto(DeviceStatus.Online));
            }).WithTags("Roku Devices")
            .Produces<RokuTvDto>(200, "application/json");
        
        app.MapPost("/api/roku/devices/apps", async (
                RokuDeviceRequest req, 
                [FromServices]RokuService service, 
                [FromServices] AppDbContext db,
                [FromServices] IMemoryCache cache,
                CancellationToken ct) =>
        {
            var ip = await GetDeviceIpAsync(cache, db, req.DeviceId);
            if (string.IsNullOrWhiteSpace(ip))
                return Results.NotFound("Device not found.");
            var info = await service.GetInstalledApps(ip);
            return Results.Ok(info);
        }).WithTags("Roku Devices")
        .Produces<RokuApps>(200, "application/json");


        app.MapPost("/api/roku/devices/keyPress", async (
                RokuKeypressRequest req,
                [FromServices]RokuService service,
                [FromServices] AppDbContext db,
                [FromServices] IMemoryCache cache,
                CancellationToken ct) =>
        {
            var ip = await GetDeviceIpAsync(cache, db, req.DeviceId);
            if (string.IsNullOrWhiteSpace(ip))
                return Results.NotFound("Device not found.");
            var info = await service.SendKeyPress(ip, req.Keypress, req.additionalData);
            return Results.Ok(info);
        }).WithTags("Roku Devices")
        .Produces<bool>(200, "plain/text");


        app.MapPost("/api/roku/devices/apps/icon", async (
                RokuIconRequest req,
                [FromServices] RokuService service,
                [FromServices] AppDbContext db,
                [FromServices] IMemoryCache cache,
                CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(req.DeviceId))
                return Results.BadRequest("Roku device IP is required.");
            var ip = await GetDeviceIpAsync(cache, db, req.DeviceId);
            if (string.IsNullOrWhiteSpace(ip))
                return Results.NotFound("Device not found.");
            try
            {
                var iconBytes = await service.GetAppIconAsync(ip, req.AppId);
                return Results.File(iconBytes, "image/png");
            }
            catch (HttpRequestException ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        }).WithTags("Roku Devices")
        .Produces<IResult>(200, "image/png");

        app.MapDelete("/api/roku/devices", async (
            [FromQuery] string id,
            [FromServices] MulticastBackgroundService multicastService,
            [FromServices] AppDbContext db,
            CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(id))
                return Results.BadRequest("Id is required.");
            var device = await db.RokuDevices
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken: ct);

            if (device == null)
                return Results.NotFound("Device not found.");
            db.RokuDevices.Remove(device);
            await db.SaveChangesAsync(ct);
            return Results.Ok("Device removed successfully.");
        }).WithTags("Roku Devices")
        .Produces<string>(200, "plain/text");
        
        return app;
    }
    
    private static async Task<string?> GetDeviceIpAsync(IMemoryCache cache, AppDbContext db, string deviceId)
    {
        var ip = cache.Get<string>(deviceId);
        if (!string.IsNullOrWhiteSpace(ip))
            return ip;
        var savedDevice = await db.RokuDevices  
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