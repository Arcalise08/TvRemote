import {SamsungKeypress, SamsungKeypressType, SamsungTvInfo} from "../models/samsung-direct-types.ts";


export class SamsungApi {
    _token: string;
    _baseUrl: string;

    constructor(token: string, baseUrl: string) {
        this._token = token;
        this._baseUrl = baseUrl;
    }

    async scanForSamsungDevices() {
        const response = await fetch(this._baseUrl + "/api/samsung/devices", {
            headers: {
                Authorization: `Bearer ${this._token}`
            }});
        if (!response.ok)
            return [];
        const results = await response.json();
        return results as string[];
    }

    async getDeviceInfo(ip : string) {
        const response = await fetch(this._baseUrl + "/api/samsung/devices", {
            method: "POST",
            body: JSON.stringify({ip}),
            headers: {
                Authorization: `Bearer ${this._token}`,
                "Content-Type": "application/json"
            }});
        if (!response.ok)
            return null;
        const results = await response.json();
        console.log(results);
        return results as SamsungTvInfo;
    }

    async getConnectedDevices() {
        const response = await fetch(this._baseUrl + "/api/samsung/devices/connected", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this._token}`,
                "Content-Type": "application/json"
            }});
        if (!response.ok)
            return null;
        const results = await response.json();
        console.log(results);
        return results as string[];
    }

    async getSavedDevices() {
        console.log("Getting saved devices");
        console.log(this._baseUrl);
        console.log(this._token)
        const response = await fetch(this._baseUrl + "/api/samsung/devices/devices-saved", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this._token}`,
                "Content-Type": "application/json"
            }});
        if (!response.ok)
            return [];
        console.log(response);
        const results = await response.json();
        return results as string[]
    }
    async connectToDevice(ip : string) {
        const response = await fetch(this._baseUrl + "/api/samsung/devices/connect", {
            method: "POST",
            body: JSON.stringify({ip}),
            headers: {
                Authorization: `Bearer ${this._token}`,
                "Content-Type": "application/json"
            }});
        if (!response.ok)
            return null;
        const results = await response.json();
        console.log(results);
        return results as boolean;
    }
    

    async sendKeyPress(ip : string, keypress : SamsungKeypress, type : SamsungKeypressType) {
        const body = {
            ip,
            keypress,
            type
        };
        try {
            const response = await fetch(this._baseUrl + "/api/samsung/devices/keyPress", {
                body: JSON.stringify(body),
                headers: {
                    Authorization: `Bearer ${this._token}`,
                    "Content-Type": "application/json"
                },
                method:"POST",
            });
            if (!response.ok)
                return false;
            return await response.text() === "true";
        }
        catch (error){
            return false;
        }
    }
}