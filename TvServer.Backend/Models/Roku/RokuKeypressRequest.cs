namespace TvServerV2.Models.Roku;

public record RokuKeypressRequest(
    string DeviceId,
    RokuKeypress Keypress,
    string? additionalData
);