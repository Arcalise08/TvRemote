namespace TvServer.Models.Samsung;

using System;
using System.Collections.Generic;

public class Attributes
{
    public string Name { get; set; }
}

public class Client
{
    public Attributes Attributes { get; set; }
    public long ConnectTime { get; set; }
    public string DeviceName { get; set; }
    public string Id { get; set; }
    public bool IsHost { get; set; }
}

public class Data
{
    public List<Client> Clients { get; set; }
    public string Id { get; set; }
    public string Token { get; set; }
}

public class SamsungConnectEvent
{
    public Data Data { get; set; }
    public string Event { get; set; }
}


