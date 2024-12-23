using System.Xml.Linq;

namespace TvServer.Models;

public record RokuDeviceInfo
{
    public string Udn { get; init; }
    public string SerialNumber { get; init; }
    public string DeviceId { get; init; }
    public string AdvertisingId { get; init; }
    public string VendorName { get; init; }
    public string ModelName { get; init; }
    public string ModelNumber { get; init; }
    public string ModelRegion { get; init; }
    public bool IsTv { get; init; }
    public bool IsStick { get; init; }
    public int ScreenSize { get; init; }
    public int PanelId { get; init; }
    public bool MobileHasLiveTv { get; init; }
    public string UiResolution { get; init; }
    public string TunerType { get; init; }
    public bool SupportsEthernet { get; init; }
    public string WifiMac { get; init; }
    public string WifiDriver { get; init; }
    public bool HasWifi5GSupport { get; init; }
    public string EthernetMac { get; init; }
    public string NetworkType { get; init; }
    public string NetworkName { get; init; }
    public string FriendlyDeviceName { get; init; }
    public string FriendlyModelName { get; init; }
    public string DefaultDeviceName { get; init; }
    public string UserDeviceName { get; init; }
    public string UserDeviceLocation { get; init; }
    public string BuildNumber { get; init; }
    public string SoftwareVersion { get; init; }
    public string SoftwareBuild { get; init; }
    public string LightningBaseBuildNumber { get; init; }
    public string UiBuildNumber { get; init; }
    public string UiSoftwareVersion { get; init; }
    public string UiSoftwareBuild { get; init; }
    public bool SecureDevice { get; init; }
    public string Language { get; init; }
    public string Country { get; init; }
    public string Locale { get; init; }
    public bool TimeZoneAuto { get; init; }
    public string TimeZone { get; init; }
    public string TimeZoneName { get; init; }
    public string TimeZoneTz { get; init; }
    public int TimeZoneOffset { get; init; }
    public string ClockFormat { get; init; }
    public int Uptime { get; init; }
    public string PowerMode { get; init; }
    public bool SupportsSuspend { get; init; }
    public bool SupportsFindRemote { get; init; }
    public bool SupportsAudioGuide { get; init; }
    public bool SupportsRva { get; init; }
    public bool HasHandsFreeVoiceRemote { get; init; }
    public bool DeveloperEnabled { get; init; }
    public string KeyedDeveloperId { get; init; }
    public bool DeviceAutomationBridgeEnabled { get; init; }
    public bool SearchEnabled { get; init; }
    public bool SearchChannelsEnabled { get; init; }
    public bool VoiceSearchEnabled { get; init; }
    public bool SupportsPrivateListening { get; init; }
    public bool SupportsPrivateListeningDtv { get; init; }
    public bool SupportsWarmStandby { get; init; }
    public bool HeadphonesConnected { get; init; }
    public bool SupportsAudioSettings { get; init; }
    public float ExpertPqEnabled { get; init; }
    public bool SupportsEcsTextedit { get; init; }
    public bool SupportsEcsMicrophone { get; init; }
    public bool SupportsWakeOnWlan { get; init; }
    public bool SupportsAirplay { get; init; }
    public bool HasPlayOnRoku { get; init; }
    public bool HasMobileScreensaver { get; init; }
    public string SupportUrl { get; init; }
    public string GrandcentralVersion { get; init; }
    public bool SupportsTrc { get; init; }
    public string TrcVersion { get; init; }
    public string TrcChannelVersion { get; init; }
    public string AvSyncCalibrationEnabled { get; init; }
    
    public static RokuDeviceInfo Parse(string xmlData)
    {
        var doc = XDocument.Parse(xmlData);
        return new RokuDeviceInfo
        {
            Udn = doc.Root.Element("udn")?.Value,
            SerialNumber = doc.Root.Element("serial-number")?.Value,
            DeviceId = doc.Root.Element("device-id")?.Value,
            AdvertisingId = doc.Root.Element("advertising-id")?.Value,
            VendorName = doc.Root.Element("vendor-name")?.Value,
            ModelName = doc.Root.Element("model-name")?.Value,
            ModelNumber = doc.Root.Element("model-number")?.Value,
            ModelRegion = doc.Root.Element("model-region")?.Value,
            IsTv = bool.Parse(doc.Root.Element("is-tv")?.Value ?? "false"),
            IsStick = bool.Parse(doc.Root.Element("is-stick")?.Value ?? "false"),
            ScreenSize = int.Parse(doc.Root.Element("screen-size")?.Value ?? "0"),
            PanelId = int.Parse(doc.Root.Element("panel-id")?.Value ?? "0"),
            MobileHasLiveTv = bool.Parse(doc.Root.Element("mobile-has-live-tv")?.Value ?? "false"),
            UiResolution = doc.Root.Element("ui-resolution")?.Value,
            TunerType = doc.Root.Element("tuner-type")?.Value,
            SupportsEthernet = bool.Parse(doc.Root.Element("supports-ethernet")?.Value ?? "false"),
            WifiMac = doc.Root.Element("wifi-mac")?.Value,
            WifiDriver = doc.Root.Element("wifi-driver")?.Value,
            HasWifi5GSupport = bool.Parse(doc.Root.Element("has-wifi-5G-support")?.Value ?? "false"),
            EthernetMac = doc.Root.Element("ethernet-mac")?.Value,
            NetworkType = doc.Root.Element("network-type")?.Value,
            NetworkName = doc.Root.Element("network-name")?.Value,
            FriendlyDeviceName = doc.Root.Element("friendly-device-name")?.Value,
            FriendlyModelName = doc.Root.Element("friendly-model-name")?.Value,
            DefaultDeviceName = doc.Root.Element("default-device-name")?.Value,
            UserDeviceName = doc.Root.Element("user-device-name")?.Value,
            UserDeviceLocation = doc.Root.Element("user-device-location")?.Value,
            BuildNumber = doc.Root.Element("build-number")?.Value,
            SoftwareVersion = doc.Root.Element("software-version")?.Value,
            SoftwareBuild = doc.Root.Element("software-build")?.Value,
            LightningBaseBuildNumber = doc.Root.Element("lightning-base-build-number")?.Value,
            UiBuildNumber = doc.Root.Element("ui-build-number")?.Value,
            UiSoftwareVersion = doc.Root.Element("ui-software-version")?.Value,
            UiSoftwareBuild = doc.Root.Element("ui-software-build")?.Value,
            SecureDevice = bool.Parse(doc.Root.Element("secure-device")?.Value ?? "false"),
            Language = doc.Root.Element("language")?.Value,
            Country = doc.Root.Element("country")?.Value,
            Locale = doc.Root.Element("locale")?.Value,
            TimeZoneAuto = bool.Parse(doc.Root.Element("time-zone-auto")?.Value ?? "false"),
            TimeZone = doc.Root.Element("time-zone")?.Value,
            TimeZoneName = doc.Root.Element("time-zone-name")?.Value,
            TimeZoneTz = doc.Root.Element("time-zone-tz")?.Value,
            TimeZoneOffset = int.Parse(doc.Root.Element("time-zone-offset")?.Value ?? "0"),
            ClockFormat = doc.Root.Element("clock-format")?.Value,
            Uptime = int.Parse(doc.Root.Element("uptime")?.Value ?? "0"),
            PowerMode = doc.Root.Element("power-mode")?.Value,
            SupportsSuspend = bool.Parse(doc.Root.Element("supports-suspend")?.Value ?? "false"),
            SupportsFindRemote = bool.Parse(doc.Root.Element("supports-find-remote")?.Value ?? "false"),
            SupportsAudioGuide = bool.Parse(doc.Root.Element("supports-audio-guide")?.Value ?? "false"),
            SupportsRva = bool.Parse(doc.Root.Element("supports-rva")?.Value ?? "false"),
            HasHandsFreeVoiceRemote = bool.Parse(doc.Root.Element("has-hands-free-voice-remote")?.Value ?? "false"),
            DeveloperEnabled = bool.Parse(doc.Root.Element("developer-enabled")?.Value ?? "false"),
            KeyedDeveloperId = doc.Root.Element("keyed-developer-id")?.Value,
            DeviceAutomationBridgeEnabled = bool.Parse(doc.Root.Element("device-automation-bridge-enabled")?.Value ?? "false"),
            SearchEnabled = bool.Parse(doc.Root.Element("search-enabled")?.Value ?? "false"),
            SearchChannelsEnabled = bool.Parse(doc.Root.Element("search-channels-enabled")?.Value ?? "false"),
            VoiceSearchEnabled = bool.Parse(doc.Root.Element("voice-search-enabled")?.Value ?? "false"),
            SupportsPrivateListening = bool.Parse(doc.Root.Element("supports-private-listening")?.Value ?? "false"),
            SupportsPrivateListeningDtv = bool.Parse(doc.Root.Element("supports-private-listening-dtv")?.Value ?? "false"),
            SupportsWarmStandby = bool.Parse(doc.Root.Element("supports-warm-standby")?.Value ?? "false"),
            HeadphonesConnected = bool.Parse(doc.Root.Element("headphones-connected")?.Value ?? "false"),
            SupportsAudioSettings = bool.Parse(doc.Root.Element("supports-audio-settings")?.Value ?? "false"),
            ExpertPqEnabled = float.Parse(doc.Root.Element("expert-pq-enabled")?.Value ?? "0"),
            SupportsEcsTextedit = bool.Parse(doc.Root.Element("supports-ecs-textedit")?.Value ?? "false"),
            SupportsEcsMicrophone = bool.Parse(doc.Root.Element("supports-ecs-microphone")?.Value ?? "false"),
            SupportsWakeOnWlan = bool.Parse(doc.Root.Element("supports-wake-on-wlan")?.Value ?? "false"),
            SupportsAirplay = bool.Parse(doc.Root.Element("supports-airplay")?.Value ?? "false"),
            HasPlayOnRoku = bool.Parse(doc.Root.Element("has-play-on-roku")?.Value ?? "false"),
            HasMobileScreensaver = bool.Parse(doc.Root.Element("has-mobile-screensaver")?.Value ?? "false"),
            SupportUrl = doc.Root.Element("support-url")?.Value,
            GrandcentralVersion = doc.Root.Element("grandcentral-version")?.Value,
            SupportsTrc = bool.Parse(doc.Root.Element("supports-trc")?.Value ?? "false"),
            TrcVersion = doc.Root.Element("trc-version")?.Value,
            TrcChannelVersion = doc.Root.Element("trc-channel-version")?.Value,
            AvSyncCalibrationEnabled = doc.Root.Element("av-sync-calibration-enabled")?.Value,
        };
    }

}