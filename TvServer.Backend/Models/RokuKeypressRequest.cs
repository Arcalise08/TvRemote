namespace TvServer.Models;

public record RokuKeypressRequest(
    string Ip,
    RokuKeypress Keypress,
    string? additionalData
);