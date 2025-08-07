using System.Net;
using System.Net.Sockets;
using System.Text;
using Microsoft.EntityFrameworkCore;
using TvServer.Models;
using TvServer.Models.Roku;
using TvServer.Models.Samsung;

namespace TvServer.Services;

public class MulticastBackgroundService(IServiceProvider serviceProvider)
{
    private const string SsdpAddress = "239.255.255.250";
    private const int SsdpPort = 1900;
    private static UdpClient? udpClient;
    
    protected async Task Initialize()
    {
        var localIp = Dns.GetHostEntry(Dns.GetHostName())
            .AddressList
            .FirstOrDefault(ip => ip.AddressFamily == AddressFamily.InterNetwork)?.ToString() ?? "127.0.0.1";

        udpClient = new UdpClient();
        udpClient.EnableBroadcast = true;
        udpClient.JoinMulticastGroup(IPAddress.Parse(SsdpAddress));

        var localEndPoint = new IPEndPoint(IPAddress.Parse(localIp), 0);
        udpClient.Client.Bind(localEndPoint);
    }
    
    public async Task BroadcastDiscoveryRequest(DeviceType deviceType)
    {
        if (udpClient == null) 
            await Initialize();
        if (udpClient == null) return;
        
        var searchTargets = deviceType switch
        {
            DeviceType.Roku => new List<string> {"roku:ecp"},
            DeviceType.Samsung => new List<string>
            {
                "urn:samsung.com:device:RemoteControlReceiver:1",
                "urn:schemas-upnp-org:device:MediaRenderer:1"
            },
            _ => new List<string> {"ssdp:all"},
        };
        foreach (var searchTarget in searchTargets)
        { 
            var ssdpRequest = 
                "M-SEARCH * HTTP/1.1\r\n" +
                "HOST: 239.255.255.250:1900\r\n" +
                "MAN: \"ssdp:discover\"\r\n" +
                "MX: 3\r\n" +
                $"ST: {searchTarget}\r\n\r\n";            
                
            var requestBytes = Encoding.UTF8.GetBytes(ssdpRequest);
            var ssdpEndPoint = new IPEndPoint(IPAddress.Parse(SsdpAddress), SsdpPort);
            await udpClient.SendAsync(requestBytes, requestBytes.Length, ssdpEndPoint);
        }
        var periodicTimer = new PeriodicTimer(TimeSpan.FromSeconds(5));
        var counter = 0;
        while (await periodicTimer.WaitForNextTickAsync())
        {
            if (counter > 5) break;
            await CheckResponses();
            counter++;
        }
        udpClient.Dispose();
        udpClient = null;
    }

    public async Task CheckResponses()
    {
        try
        {
            if (udpClient is null || udpClient.Available == 0) return;
            IPEndPoint? remoteEndPoint = null;
            var responseBytes = udpClient.Receive(ref remoteEndPoint);
            var response = Encoding.UTF8.GetString(responseBytes);
            var device = SsdpDevice.Parse(response);
            if (string.IsNullOrWhiteSpace(device.Location) 
                || !Uri.TryCreate(device.Location, UriKind.Absolute, out Uri uri))
                return;
            var ipAddr = uri.Host;
            if (string.IsNullOrWhiteSpace(ipAddr)) return;
            using var scope = serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            if (device.RawResponse.Contains("roku", StringComparison.InvariantCultureIgnoreCase))
            {
                var savedDevice = await db.RokuDevices.FirstOrDefaultAsync(x => x.Id == device.Usn);
                if (savedDevice is null)
                {
                    var entity = new SavedRokuDeviceEntity()
                    {
                        Id = device.Usn,
                        DeviceName = "Unknown Roku Device",
                        LastKnownIp = ipAddr,
                    };
                    db.RokuDevices.Add(entity);
                    await db.SaveChangesAsync();
                    return;
                }
                if (savedDevice.LastKnownIp != ipAddr)
                {
                    savedDevice.LastKnownIp = ipAddr;
                    db.RokuDevices.Update(savedDevice);
                    await db.SaveChangesAsync();
                }
                return;
            }
            if (device.RawResponse.Contains("samsung", StringComparison.InvariantCultureIgnoreCase))
            {
                var savedDevice = await db.SamsungDevices.FirstOrDefaultAsync(x => x.Id == device.Usn);
                if (savedDevice is null)
                {
                    var entity = new SavedSamsungDeviceEntity()
                    {
                        Id = device.Usn,
                        DeviceName = "Unknown Samsung Device",
                        LastKnownIp = ipAddr,
                    };
                    db.SamsungDevices.Add(entity);
                    await db.SaveChangesAsync();
                    return;
                }
                if (savedDevice.LastKnownIp != ipAddr)
                {
                    savedDevice.LastKnownIp = ipAddr;
                    db.SamsungDevices.Update(savedDevice);
                    await db.SaveChangesAsync();
                }
                return;
            }
            
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error checking responses: {ex.Message}");
            return;
        }   
        
    }
}