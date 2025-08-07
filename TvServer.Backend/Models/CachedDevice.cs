namespace TvServer.Models;

public record CachedDevice(
    string Id,
    string IpAddress,
    string? Token
);