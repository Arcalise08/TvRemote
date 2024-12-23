namespace TvServer.Models.Samsung.Events;



public class AppData
{
    public string AppId { get; set; }
    public int AppType { get; set; }
    public string Icon { get; set; }
    public int IsLock { get; set; }
    public string Name { get; set; }
}

public class DataContainer
{
    public List<AppData> Data { get; set; }
}

public class SamsungInstalledAppsEvent
{
    public DataContainer Data { get; set; }
    public string Event { get; set; }
    public string From { get; set; }
}
