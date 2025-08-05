namespace TvServerV2.Models.Samsung;

public record SamsungKeypressRequest(
    string deviceId,
    SamsungKeypress Keypress,
    SamsungKeypressType Type
);