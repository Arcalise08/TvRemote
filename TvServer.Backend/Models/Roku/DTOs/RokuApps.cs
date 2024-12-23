using System.Xml.Serialization;

namespace TvServer.Models;

[XmlRoot("apps")]
public class RokuApps
{
    [XmlElement("app")]
    public List<RokuApp> AppList { get; set; } = new();
}

public class RokuApp
{
    [XmlAttribute("id")]
    public string Id { get; set; }

    [XmlAttribute("type")]
    public string Type { get; set; }

    [XmlAttribute("version")]
    public string Version { get; set; }

    [XmlText]
    public string Name { get; set; }
}