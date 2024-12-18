export enum RokuKeypress {
    Home = "Home",
    Back = "Back",
    Select = "Select",
    Left = "Left",
    Right = "Right",
    Down = "Down",
    Up = "Up",
    Play = "Play",
    Pause = "Pause",
    PlayPause = "PlayPause",
    Stop = "Stop",
    Rewind = "Rewind",
    FastForward = "FastForward",
    VolumeUp = "VolumeUp",
    VolumeDown = "VolumeDown",
    VolumeMute = "VolumeMute",
    PowerOn = "PowerOn",
    PowerOff = "PowerOff",
    InputTuner = "InputTuner",
    InputHDMI1 = "InputHDMI1",
    InputHDMI2 = "InputHDMI2",
    InputHDMI3 = "InputHDMI3",
    InputHDMI4 = "InputHDMI4",
    InputAV = "InputAV",
    InstantReplay = "InstantReplay",
    Info = "Info",
    Lit = "Lit",
    Enter = "Enter",
    Search = "Search",
    FindRemote = "FindRemote",
    Launch = "Launch",
    Backspace = "Backspace",
    Clear = "Clear",
    Options = "Options",
    Exit = "Exit"
}

export type RokuDevice = {
    ip: string;
    details: RokuDeviceInfo;
}

export type ProcessedRokuApp = {
    rokuApp: RokuApp;
    imgUrl: string;
}

export type RokuApps = {
    appList : RokuApp[];
}

export type RokuApp = {
    id : string
    type : string
    version : string
    name : string
}

export type RokuDeviceInfo = {
    udn: string;
    serialNumber: string;
    deviceId: string;
    advertisingId: string;
    vendorName: string;
    modelName: string;
    modelNumber: string;
    modelRegion: string;
    isTv: boolean;
    isStick: boolean;
    screenSize: number;
    panelId: number;
    mobileHasLiveTv: boolean;
    uiResolution: string;
    tunerType: string;
    supportsEthernet: boolean;
    wifiMac: string;
    wifiDriver: string;
    hasWifi5GSupport: boolean;
    ethernetMac: string;
    networkType: string;
    networkName: string;
    friendlyDeviceName: string;
    friendlyModelName: string;
    defaultDeviceName: string;
    userDeviceName: string;
    userDeviceLocation: string;
    buildNumber: string;
    softwareVersion: string;
    softwareBuild: string;
    lightningBaseBuildNumber?: string;
    uiBuildNumber: string;
    uiSoftwareVersion: string;
    uiSoftwareBuild: string;
    secureDevice: boolean;
    language: string;
    country: string;
    locale: string;
    timeZoneAuto: boolean;
    timeZone: string;
    timeZoneName: string;
    timeZoneTz: string;
    timeZoneOffset: number;
    clockFormat: string;
    uptime: number;
    powerMode: string;
    supportsSuspend: boolean;
    supportsFindRemote: boolean;
    supportsAudioGuide: boolean;
    supportsRva: boolean;
    hasHandsFreeVoiceRemote: boolean;
    developerEnabled: boolean;
    keyedDeveloperId?: string;
    deviceAutomationBridgeEnabled: boolean;
    searchEnabled: boolean;
    searchChannelsEnabled: boolean;
    voiceSearchEnabled: boolean;
    supportsPrivateListening: boolean;
    supportsPrivateListeningDtv: boolean;
    supportsWarmStandby: boolean;
    headphonesConnected: boolean;
    supportsAudioSettings: boolean;
    expertPqEnabled: number;
    supportsEcsTextedit: boolean;
    supportsEcsMicrophone: boolean;
    supportsWakeOnWlan: boolean;
    supportsAirplay: boolean;
    hasPlayOnRoku: boolean;
    hasMobileScreensaver: boolean;
    supportUrl: string;
    grandcentralVersion: string;
    supportsTrc: boolean;
    trcVersion: string;
    trcChannelVersion: string;
    avSyncCalibrationEnabled: string;
}
