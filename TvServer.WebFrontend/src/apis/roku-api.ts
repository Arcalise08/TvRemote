export class RokuApi {
    _token: string | null;
    _baseUrl: string;

    constructor(token: string | null, baseUrl: string) {
        this._token = token;
        this._baseUrl = baseUrl;
    }

    async getRokuAppIcon(deviceId: string, appId: string): Promise<Blob> {
        try {
            const headers: HeadersInit = {
                contentType: "application/json",
            };
            if (this._token)
                headers.Authorization = `Bearer ${this._token}`;
            const response = await fetch(this._baseUrl + `/api/roku/devices/apps/icon`, {
                body: JSON.stringify({deviceId, appId}),
                headers,
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