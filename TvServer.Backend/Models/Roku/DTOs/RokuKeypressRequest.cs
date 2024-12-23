namespace TvServer.Models.Roku.DTOs;

public record RokuKeypressRequest(
    string Ip,
    RokuKeypress Keypress,
    string? additionalData
);