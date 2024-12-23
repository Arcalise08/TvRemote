using Microsoft.AspNetCore.Mvc;
using TvServer.Models.Samsung;
using TvServer.Services;

namespace TvServer.Routes;

public static class SamsungRoutes
{
    public static WebApplication MapSamsungRoutes(this WebApplication app)
    {
        app.MapGet("/api/samsung/devices", async ([FromServices]SamsungDirectService service, CancellationToken ct) =>
        {
            var devices = service.DiscoverSamsungDevices();
            return Results.Ok(devices);
        }).WithTags("Samsung Devices");
        
        app.MapPost("/api/samsung/devices", async (SamsungDeviceRequest req,
            [FromServices]SamsungDirectService service,  CancellationToken ct) =>
        {
            var info = await service.GetDeviceInfo(req.Ip);
            return Results.Ok(info);
        }).WithTags("Samsung Devices");
        
        app.MapGet("/api/samsung/devices/devices-saved", async ([FromServices]SamsungDirectService service,  
            CancellationToken ct) =>
        {
            var info = service.GetSavedSamsungDevices();
            return Results.Ok(info);
        }).WithTags("Samsung Devices");
        
        app.MapPost("/api/samsung/devices/keyPress", async (SamsungKeypressRequest req, [FromServices]SamsungDirectService service,  CancellationToken ct) =>
        {
            var info = await service.SendKeyPress(req.Ip, req.Keypress, req.Type);
            return Results.Ok(info);
        }).WithTags("Samsung Devices");
        
        app.MapPost("/api/samsung/devices/launchApp", async (SamsungLaunchAppRequest req, [FromServices]SamsungDirectService service,  CancellationToken ct) =>
        {
            var info = await service.LaunchApp(req.Ip, req.AppId);
            return Results.Ok(info);
        }).WithTags("Samsung Devices");
        
        app.MapGet("/api/samsung/devices/get-installed-apps", async (string ip, [FromServices]SamsungDirectService service,  CancellationToken ct) =>
        {
            var info = await service.GetInstalledApps(ip);
            return Results.Ok(info);
        }).WithTags("Samsung Devices");
        return app;
    }
}