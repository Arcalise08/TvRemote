namespace TvServer.Models;

public class SsdpDevice
{
    public string Status { get; set; }
    public string CacheControl { get; set; }
    public string Location { get; set; }
    public string Server { get; set; }
    public string Usn { get; set; } 
    public string Nt { get; set; } 
    public string RawResponse { get; set; }
    public Dictionary<string, string> Headers { get; set; }

    public SsdpDevice()
    {
        Headers = new Dictionary<string, string>();
    }

    public static SsdpDevice Parse(string response)
    {
        var ssdpResponse = new SsdpDevice();
        ssdpResponse.RawResponse = response;
        var lines = response.Split(new[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);

        if (lines.Length > 0)
        {
            ssdpResponse.Status = lines[0];
        }

        foreach (var line in lines)
        {
            if (line.Contains(":"))
            {
                var parts = line.Split(new[] { ':' }, 2);
                var key = parts[0].Trim();
                var value = parts[1].Trim();
                switch (key.ToUpper())
                {
                    case "CACHE-CONTROL":
                        ssdpResponse.CacheControl = value;
                        break;
                    case "LOCATION":
                        ssdpResponse.Location = value;
                        break;
                    case "SERVER":
                        ssdpResponse.Server = value;
                        break;
                    case "USN":
                        ssdpResponse.Usn = value;
                        break;
                    case "NT":
                        ssdpResponse.Nt = value;
                        break;
                    default:
                        ssdpResponse.Headers[key] = value; 
                        break;
                }
            }
        }
        return ssdpResponse;
        
    }
}