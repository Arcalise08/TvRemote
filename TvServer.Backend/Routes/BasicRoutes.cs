using Microsoft.AspNetCore.Mvc;
using TvServer.Models;
using TvServer.Services;

namespace TvServer.Routes;

public static class BasicRoutes
{
    public static WebApplication MapBasicRoutes(this WebApplication app)
    {
        app.MapGet("/api/broadcast", async (
                [FromServices] MulticastBackgroundService multicastService,
                [FromServices] AppDbContext db,
                CancellationToken ct) =>
            {
                _ = multicastService.BroadcastDiscoveryRequest(DeviceType.Samsung);
                _ = multicastService.BroadcastDiscoveryRequest(DeviceType.Roku);
                return Results.Ok("Discovery request sent.");
            }).WithTags("Basic Actions")
            .Produces<string>(200, "plain/text");
        return app;
    }
}