
export type SmartThingErrorDetail = {
    code : string;
    target: string;
    message: string;
}

export type SmartThingError = {
    code : string;
    message : string;
    details: SmartThingErrorDetail[]
}
export type SmartThingRequestFailed = {
    error: SmartThingError;
}

export type SmartThingsInputMap = {
    id: string;
    name: string;
}

export type SmartThingDeviceStatus= {
    components: {
        main: {
            switch: {
                switch: {
                    value: string;
                }
            },
            "switchLevel": {
                "level": {
                    "value": number
                }
            },
            audioVolume: {
                volume: {
                    value: number
                    unit: string,
                    timestamp: Date
                }
            },
            "samsungvd.mediaInputSource": {
                supportedInputSourcesMap: {
                    value: SmartThingsInputMap[];
                    timestamp:Date
                },
                inputSource: {
                    value: string;
                    timestamp: Date
                }
            }
        }
    }
}

export type SmartThingsDevice = {
    createTime: Date;
    deviceId: string;
    deviceManufacturerCode: string;
    deviceTypeName: string;
    name: string;
    executionContext: string;
    ownerId : string;
    label: string;
    locationId: string;
}
export enum STRemoteButtonValues {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
    Ok = "OK",
    Back = "BACK",
    Pause = "PAUSE",
    Play = "PLAY",
    Menu = "MENU",
    Home = "HOME",
    Exit = "EXIT",
}

export enum STRemoteButtonKeyStates {
    Pressed = "PRESSED",
    Released = "RELEASED",
    Press_And_Released = "PRESS_AND_RELEASED"
}

export type STTvCommand = {
    component: string;
    capability: string;
    command: string;
    arguments: string[] | number[]
}

/// RESPONSES
export type GetSmartThingsDevicesResponse = {
        items: SmartThingsDevice[]
}

export type CommandResponse = {
    id: string;
    status: "COMPLETED"
}
export type SmartThingsCommandResponse = {
    results: SmartThingsCommandResponse[]
}

