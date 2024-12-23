export type DeviceInfo = {
    frameTVSupport?: string;
    gamePadSupport?: string;
    imeSyncedSupport?: string;
    language?: string;
    os?: string;
    powerState?: string;
    tokenAuthSupport?: string;
    voiceSupport?: string;
    wallScreenRatio?: string;
    wallService?: string;
    countryCode?: string;
    description?: string;
    developerIP?: string;
    developerMode?: string;
    duid?: string;
    firmwareVersion?: string;
    id?: string;
    ip?: string;
    model?: string;
    modelName?: string;
    name?: string;
    networkType?: string;
    resolution?: string;
    smartHubAgreement?: string;
    ssid?: string;
    type?: string;
    udn?: string;
    wifiMac?: string;
};

export type SamsungTvInfo = {
    device?: DeviceInfo;
    id?: string;
    isSupport?: string;
    name?: string;
    remote?: string;
    type?: string;
    uri?: string;
    version?: string;
};

export type SamsungDevice = {
    ip : string;
    device: DeviceInfo;
}

export enum SamsungKeypress
{
    KEY_POWER = "KEY_POWER",
    KEY_HOME = "KEY_HOME",
    KEY_SOURCE = "KEY_SOURCE",
    KEY_GUIDE = "KEY_GUIDE",
    KEY_TOOLS = "KEY_TOOLS",
    KEY_INFO = "KEY_INFO",

    KEY_UP = "KEY_UP",
    KEY_DOWN = "KEY_DOWN",
    KEY_LEFT = "KEY_LEFT",
    KEY_RIGHT = "KEY_RIGHT",
    KEY_ENTER = "KEY_ENTER",
    KEY_RETURN = "KEY_RETURN",

    KEY_CH_LIST = "KEY_CH_LIST",

    KEY_CHUP = "KEY_CHUP",
    KEY_CHDOWN = "KEY_CHDOWN",
    KEY_VOLUP = "KEY_VOLUP",
    KEY_VOLDOWN = "KEY_VOLDOWN",
    KEY_MUTE = "KEY_MUTE",

    KEY_RED = "KEY_RED",
    KEY_GREEN = "KEY_GREEN",
    KEY_YELLOW = "KEY_YELLOW",
    KEY_BLUE = "KEY_BLUE",
    KEY_FACTORY = "KEY_FACTORY"
}

export enum SamsungKeypressType
{
    Click = "Click",
    Press = "Press",
    Release = "Release"
}