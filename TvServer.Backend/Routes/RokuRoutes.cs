using Microsoft.AspNetCore.Mvc;
using TvServer.Models;
using TvServer.Models.Roku.DTOs;
using TvServer.Services;

namespace TvServer.Routes;

public static class RokuRoutes
{
    public static WebApplication MapRokuRoutes(this WebApplication app)
    {
        app.MapGet("/api/roku/devices", async ([FromServices]RokuService service, CancellationToken ct) =>
        {
            var devices = service.DiscoverRokuDevices();
            return Results.Ok(devices);
        }).WithTags("Roku Devices");

        app.MapPost("/api/roku/devices", async (RokuDeviceRequest req, [FromServices]RokuService service,  CancellationToken ct) =>
        {
            var info = await service.GetDeviceInfo(req.Ip);
            return Results.Ok(info);
        }).WithTags("Roku Devices");

        app.MapPost("/api/roku/devices/apps", async (RokuDeviceRequest req, [FromServices]RokuService service,  CancellationToken ct) =>
        {
            var info = await service.GetInstalledApps(req.Ip);
            return Results.Ok(info);
        }).WithTags("Roku Devices");

        app.MapPost("/api/roku/devices/keyPress", async (RokuKeypressRequest req, [FromServices]RokuService service,  CancellationToken ct) =>
        {
            var info = await service.SendKeyPress(req.Ip, req.Keypress, req.additionalData);
            return Results.Ok(info);
        }).WithTags("Roku Devices");

        app.MapPost("/api/roku/devices/apps/icon", async (RokuIconRequest req, [FromServices] RokuService service, CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(req.Ip))
                return Results.BadRequest("Roku device IP is required.");
            try
            {
                var iconBytes = await service.GetAppIconAsync(req.Ip, req.AppId);
                return Results.File(iconBytes, "image/png");
            }
            catch (HttpRequestException ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        }).WithTags("Roku Devices");
        return app;
    }
}