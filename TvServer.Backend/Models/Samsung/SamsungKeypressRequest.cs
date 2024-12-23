namespace TvServer.Models.Samsung;

public record SamsungKeypressRequest(
    string Ip,
    SamsungKeypress Keypress,
    SamsungKeypressType Type
);