namespace TvServer.Models.Samsung;

public record SamsungKeypressRequest(
    string deviceId,
    SamsungKeypress Keypress,
    SamsungKeypressType Type
);