namespace TvServer.Models.Roku;

public record RokuKeypressRequest(
    string DeviceId,
    RokuKeypress Keypress,
    string? additionalData
);