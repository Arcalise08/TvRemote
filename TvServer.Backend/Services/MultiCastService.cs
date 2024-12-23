using System.Net;
using System.Net.Sockets;
using System.Text;
using TvServer.Models;

namespace TvServer.Services;

public class MultiCastService
{
    private const string SsdpAddress = "239.255.255.250";
    private const int SsdpPort = 1900;
    public List<SsdpDevice> DiscoverDevices(string searchTarget)
    {
        string ssdpRequest = 
            "M-SEARCH * HTTP/1.1\r\n" +
            "HOST: 239.255.255.250:1900\r\n" +
            "MAN: \"ssdp:discover\"\r\n" +
            "MX: 3\r\n" +
            $"ST: {searchTarget}\n\r\n\r\n";


        using UdpClient client = new UdpClient();
        client.EnableBroadcast = true;
        IPEndPoint localEndPoint = new IPEndPoint(IPAddress.Any, 0);
        client.Client.Bind(localEndPoint);

        byte[] requestBytes = Encoding.UTF8.GetBytes(ssdpRequest);
        IPEndPoint ssdpEndPoint = new IPEndPoint(IPAddress.Parse(SsdpAddress), SsdpPort);
        client.Send(requestBytes, requestBytes.Length, ssdpEndPoint);

        var timeout = DateTime.Now.AddSeconds(5);
        var rawResponses = new List<string>();
        while (DateTime.Now < timeout)
        {
            if (client.Available > 0)
            {
                IPEndPoint remoteEndPoint = null;
                byte[] responseBytes = client.Receive(ref remoteEndPoint);
                string response = Encoding.UTF8.GetString(responseBytes);
                rawResponses.Add(response);
            }
        }
        var devices = new List<SsdpDevice>();
        foreach (var response in rawResponses)
        {
            var device = SsdpDevice.Parse(response);
            if (string.IsNullOrWhiteSpace(device.Location)
                || devices.Any(x => x.Location.Equals(device.Location)))
                continue;
            
            devices.Add(SsdpDevice.Parse(response));
        }
        return devices;
    }
}