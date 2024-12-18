import {
    GetSmartThingsDevicesResponse,
    SmartThingDeviceStatus,
    SmartThingRequestFailed,
    SmartThingsCommandResponse,
    STRemoteButtonCommand,
    STTvCommand
} from "../models/smart-thing-types.ts";
import {Result} from "../models/global-types.ts";


export class SmartThingsApi {
    _token : string;
    _baseUrl: string;
    constructor(token: string, baseUrl : string) {
        this._token = token;
        this._baseUrl = baseUrl;
    }

    private processSmartThingsResponse = async <TExpectedResult>(r : Response) => {
        if (r.status === 200) {
            const json = await r.json() as TExpectedResult;
            if (!json)
                return {
                    isSuccessful : false,
                    error: "An error has occurred"
                } as Result<TExpectedResult>
            return {
                isSuccessful : true,
                data: json
            } as Result<TExpectedResult>
        }
        else {
            const json = await r.json() as SmartThingRequestFailed;
            console.log("Request failed");
            console.log(json);
            return {
                isSuccessful : false,
                error: json.error.message ?? "An error has occurred",
            }
        }
    }
    async loadDevices() {
        const response = await fetch(
            this._baseUrl + "/devices",
            {headers: {Authorization: `Bearer ${this._token}`}})
        return await this.processSmartThingsResponse<GetSmartThingsDevicesResponse>(response)
    }

    async getDeviceStatus(deviceId : string) {
        const response = await fetch(
            this._baseUrl + `/devices/${deviceId}/status`,
            {headers: {Authorization: `Bearer ${this._token}`}})
        return await this.processSmartThingsResponse<SmartThingDeviceStatus>(response)
    }

    private async sendTvCommand(deviceId : string, commands : STTvCommand[]) {
        const response = await fetch(
            this._baseUrl + `/devices/${deviceId}/commands`,
            {
                method: 'POST',
                body: JSON.stringify({
                    commands: [...commands]
                }),
                headers: {Authorization: `Bearer ${this._token}`}
            })
        return await this.processSmartThingsResponse<SmartThingsCommandResponse>(response);
    }

    async turnTvOn(deviceId : string) {
        const tvCommand : STTvCommand = {
            component:"main",
            capability:"switch",
            command: "on",
            arguments: []
        }
        return await this.sendTvCommand(deviceId, [tvCommand])
    }

    async turnTvOff(deviceId : string) {
        const tvCommand : STTvCommand = {
            component:"main",
            capability:"switch",
            command: "off",
            arguments: []
        }
        return await this.sendTvCommand(deviceId, [tvCommand])
    }

    async setTvVolume(deviceId : string, volume : number) {
        if (volume < 0 || volume > 100)
            return {
                isSuccessful : false,
                error: "Invalid volume number entered"
            } as Result<SmartThingsCommandResponse>
        const tvCommand : STTvCommand = {
            component:"main",
            capability:"audioVolume",
            command: "setVolume",
            arguments: [volume]
        }
        return await this.sendTvCommand(deviceId, [tvCommand])
    }

    async toggleMuteTv(deviceId : string, mute: boolean) {
        const tvCommand : STTvCommand = {
            component:"main",
            capability:"audioMute",
            command: mute? "mute" : "unmute",
            arguments: []
        }
        return await this.sendTvCommand(deviceId, [tvCommand])
    }

    async launchApp(deviceId : string, appId: string) {
        const tvCommand : STTvCommand = {
            component:"main",
            capability:"custom.launchapp",
            command: "launchApp",
            arguments: [appId]
        }
        const result =  await this.sendTvCommand(deviceId, [tvCommand])
        console.log(result)
        return result;
    }

    async changeTvInput(deviceId : string, input: string) {
        const tvCommand : STTvCommand = {
            component:"main",
            capability:"mediaInputSource",
            command: "setInputSource",
            arguments: [input]
        }
        return await this.sendTvCommand(deviceId, [tvCommand])
    }

    async sendRemotePress(deviceId : string, presses : STRemoteButtonCommand[]) {
        const commands = [];
        for (const command of presses) {
            commands.push(command.Button)
            commands.push(command.Type)
        }

        const tvCommand : STTvCommand = {
            component:"main",
            capability:"samsungvd.remoteControl",
            command: "send",
            arguments: commands
        }
        return await this.sendTvCommand(deviceId, [tvCommand])
    }
}

