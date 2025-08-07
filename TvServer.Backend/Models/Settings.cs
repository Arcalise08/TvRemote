using System.Text.Json;

namespace TvServer.Models;

public class SamsungTvProfile
{
    public string Ip { get; set; }
    public string? Token { get; set; }
}

public class Settings
{
    public List<SamsungTvProfile> SamsungTvProfiles { get; set; } = new List<SamsungTvProfile>();

    public static async Task<Settings> LoadSettings()
    {
        var path = Path.Combine(Environment.CurrentDirectory, "settings.json");
        if (!File.Exists(path))
            await File.WriteAllTextAsync(path, "{\n \"SamsungTvProfiles\":[]\n}");
        var text = await File.ReadAllTextAsync(path);
        var settings = JsonSerializer.Deserialize<Settings>(text);
        return settings ?? new Settings();
    }
    
    public async Task SaveSettings()
    {
        var path = Path.Combine(Environment.CurrentDirectory, "settings.json");
        await File.WriteAllTextAsync(path, JsonSerializer.Serialize(this));
    }
}