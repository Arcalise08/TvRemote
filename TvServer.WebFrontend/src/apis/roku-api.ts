import {RokuApps, RokuDeviceInfo, RokuKeypress} from "../models/roku-types.ts";


export class RokuApi {
    _token: string;
    _baseUrl: string;

    constructor(token: string, baseUrl: string) {
        this._token = token;
        this._baseUrl = baseUrl;
    }

    async scanForRokuDevices() {
        const response = await fetch(this._baseUrl + "/api/roku/devices", {
            headers: {
                Authorization: `Bearer ${this._token}`
            }});
        if (!response.ok)
            return [];
        const results = await response.json();
        return results as string[];
    }

    async getDeviceInfo(ip : string) {
        const response = await fetch(this._baseUrl + "/api/roku/devices", {
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
        return results as RokuDeviceInfo;
    }

    async getInstalledApps(ip : string) {
        const response = await fetch(this._baseUrl + "/api/roku/devices/apps", {
            method: "POST",
            body: JSON.stringify({ip}),
            headers: {
                Authorization: `Bearer ${this._token}`,
                "Content-Type": "application/json"
            }});
        if (!response.ok)
            return null;
        const results = await response.json();
        return results as RokuApps;
    }

    async sendKeyPress(ip : string, keypress : RokuKeypress, additionalData : string | null) {
        const body = {
            ip,
            keypress
        } as {ip : string; keypress : RokuKeypress; additionalData ?: string | null};
        if (additionalData)
            body.additionalData = additionalData;
        try {
            const response = await fetch(this._baseUrl + "/api/roku/devices/keyPress", {
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

    async getRokuAppIcon(ip: string, appId: string): Promise<Blob> {
        try {
            const response = await fetch(this._baseUrl + `/api/roku/devices/apps/icon`, {
                body: JSON.stringify({ip, appId}),
                headers: {
                    Authorization: `Bearer ${this._token}`,
                    "Content-Type": "application/json"
                },
                method:"POST",
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch app icon. Status: ${response.status}`);
            }
            return await response.blob();
        } catch (error) {
            console.error('Error fetching app icon:', error);
            throw error;
        }
    }
}