using Microsoft.EntityFrameworkCore;
using TvServer.Models;
using TvServer.Routes;
using TvServer.Services;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
services.AddEndpointsApiExplorer();

services.AddCors(defaultPolicy => defaultPolicy.AddDefaultPolicy(
    builder => builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
));
services.AddSwaggerGen();
services.AddSingleton<RokuService>();
services.AddSingleton<SamsungDirectService>();
services.AddSingleton<MulticastBackgroundService>();
services.AddMemoryCache();
builder.Services.AddSingleton(await Settings.LoadSettings());
services.AddHttpClient("default", client =>
{
    client.Timeout = TimeSpan.FromSeconds(10);
});
services.AddHttpClient("no-ssl", client =>
    {
        client.Timeout = TimeSpan.FromSeconds(10);
    })
    .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
    {
        ServerCertificateCustomValidationCallback = (m, c, ch, e) => true
    });
services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("postgres")));
var app = builder.Build();
app.UseCors();

app.UseSwagger();
app.UseSwaggerUI();

app.MapRokuRoutes();
app.MapSamsungRoutes();
app.MapBasicRoutes();

app.UseStaticFiles();
app.UseRouting();
app.MapFallbackToFile("index.html");
app.Run();