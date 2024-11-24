
export const CecTVDeviceId = "636abf3e-d7ff-4541-b305-86bec3d17d1d";

export class CecApi {
    _token: string;
    _baseUrl: string;

    constructor(token: string, baseUrl: string) {
        this._token = token;
        this._baseUrl = baseUrl;
    }

    async turnTvOn() {
        const response = await fetch(this._baseUrl + "/api/turn-tv-on", {
            headers: {
                Authorization: `Bearer ${this._token}`
            }
        })
        if (!response.ok)
            return false;
        console.log(response.text());
        return true;

    }

}