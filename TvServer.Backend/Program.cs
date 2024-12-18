using System.Diagnostics;
using Makaretu.Dns;
using Microsoft.AspNetCore.Mvc;
using TvServer.Models;
using TvServer.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter the Bearer token in the format: Bearer {token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});
builder.Services.AddCors(defaultPolicy => defaultPolicy.AddDefaultPolicy(
    builder => builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
    ));
builder.Services.AddHttpClient();

builder.Services.AddSingleton<RokuService>();
var app = builder.Build();

var requiredApiKey = builder.Configuration.GetValue<string>("ApiKey");
if (string.IsNullOrWhiteSpace(requiredApiKey))
    throw new Exception("Required API Key is missing");
app.UseCors();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Use(async (context, next) =>
{
    if (!context.Request.Path.StartsWithSegments("/api"))
    {
        await next.Invoke();
        return;
    }
    if (!context.Request.Headers.TryGetValue("Authorization", out var authorizationHeader) || 
        !authorizationHeader.ToString().StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase) ||
        authorizationHeader.ToString().Substring("Bearer ".Length) != requiredApiKey)
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Unauthorized: Invalid or missing API key.");
        return;
    }
    await next();
});

app.MapGet("/api/turn-tv-on", async (CancellationToken ct) =>
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
});
app.MapGet("/api/roku/devices", async ([FromServices]RokuService service, CancellationToken ct) =>
{
    var devices = service.DiscoverRokuDevices();
    return Results.Ok(devices);
});

app.MapPost("/api/roku/devices", async (RokuDeviceRequest req, [FromServices]RokuService service,  CancellationToken ct) =>
{
    var info = await service.GetDeviceInfo(req.Ip);
    return Results.Ok(info);
});

app.MapPost("/api/roku/devices/apps", async (RokuDeviceRequest req, [FromServices]RokuService service,  CancellationToken ct) =>
{
    var info = await service.GetInstalledApps(req.Ip);
    return Results.Ok(info);
});

app.MapPost("/api/roku/devices/keyPress", async (RokuKeypressRequest req, [FromServices]RokuService service,  CancellationToken ct) =>
{
    var info = await service.SendKeyPress(req.Ip, req.Keypress, req.additionalData);
    return Results.Ok(info);
});

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
});
app.UseStaticFiles();
app.UseRouting();
app.MapFallbackToFile("index.html");
app.Run();