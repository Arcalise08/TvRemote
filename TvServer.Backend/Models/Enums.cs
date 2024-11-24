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
