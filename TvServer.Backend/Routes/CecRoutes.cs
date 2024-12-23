using System.Diagnostics;

namespace TvServer.Routes;

public static class CecRoutes
{
    public static WebApplication MapCecRoutes(this WebApplication app)
    {
        app.MapGet("/api/cec/turn-tv-on", async (CancellationToken ct) =>
        {

            var p = new ProcessStartInfo()
            {
                FileName = "/bin/bash",
                Arguments = $"-c \"echo 'on 0.0.0.0' | cec-client -s -d 1\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            var proc = Process.Start(p);

            if (proc is null)
                return Results.Problem("Failed to turn TV on");
            await proc.WaitForExitAsync(ct);
            var errorStr = proc.StandardError.ReadToEnd();
            var outputStr = proc.StandardOutput.ReadToEnd();
            return Results.Ok(outputStr + "\n" + errorStr);
        }).WithTags("Cec Devices");
        return app;
    }
}