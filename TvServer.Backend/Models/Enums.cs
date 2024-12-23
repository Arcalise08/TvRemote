using System.Text.Json.Serialization;

namespace TvServer.Models;


[JsonConverter(typeof(JsonStringEnumConverter))]
public enum RokuKeypress
{
    // Navigation Commands
    Home,
    Back,
    Select,
    Left,
    Right,
    Down,
    Up,

    // Playback Control
    Play,
    Pause,
    PlayPause,
    Stop,
    Rewind,
    FastForward,

    // Volume Control
    VolumeUp,
    VolumeDown,
    VolumeMute,

    // Power Control
    PowerOn,
    PowerOff,

    // Input Selection
    InputTuner,
    InputHDMI1,
    InputHDMI2,
    InputHDMI3,
    InputHDMI4,
    InputAV,

    // Channel/App Control
    InstantReplay,
    Info,

    // Directional Commands
    Lit, // Use "Lit_<character>" dynamically
    Enter,
    Search,
    FindRemote,

    // Media Commands
    Launch,
    Backspace,
    Clear,

    // Other Commands
    Options,
    Exit
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SamsungKeypress
{
    KEY_POWER,
    KEY_HOME,
    KEY_SOURCE,
    KEY_GUIDE,
    KEY_TOOLS,
    KEY_INFO,
    
    KEY_UP,
    KEY_DOWN,
    KEY_LEFT,
    KEY_RIGHT,
    KEY_ENTER,
    KEY_RETURN,
    
    KEY_CH_LIST,
    
    KEY_CHUP,
    KEY_CHDOWN,
    KEY_VOLUP,
    KEY_VOLDOWN,
    KEY_MUTE,
    
    KEY_EXIT,
    
    KEY_RED,
    KEY_GREEN,
    KEY_YELLOW,
    KEY_BLUE,
    KEY_FACTORY
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SamsungKeypressType
{
    Click,
    Press,
    Release
}
