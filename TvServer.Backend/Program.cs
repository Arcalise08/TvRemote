using System.Diagnostics;
using Makaretu.Dns;
using Microsoft.AspNetCore.Mvc;
using TvServer.Models;
using TvServer.Routes;
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
builder.Services.AddHttpClient("no-ssl")
    .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
    {
        ServerCertificateCustomValidationCallback = (m, c, ch, e) => true
    });
builder.Services.AddSingleton<RokuService>();
builder.Services.AddSingleton<SamsungDirectService>();
builder.Services.AddSingleton(await Settings.LoadSettings());
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

app.MapCecRoutes();
app.MapSamsungRoutes();
app.MapRokuRoutes();

app.UseStaticFiles();
app.UseRouting();
app.MapFallbackToFile("index.html");
app.Run();