import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import {immer} from 'zustand/middleware/immer'
import useTokenStore from "./useTokenStore";
import {HOME_SERVER_BASE_URL} from "../constants.ts";
import {BasicResult} from "../models/global-types.ts";
import {
    ISamsungDeviceRequest,
    ISamsungKeypressRequest,
    ISamsungLaunchAppRequest,
    SamsungDeviceRequest,
    SamsungKeypress,
    SamsungKeypressRequest,
    SamsungKeypressType,
    SamsungLaunchAppRequest,
    SamsungTvDto,
    TvControlClient
} from "../apis/TvControlClient.ts";


export interface SamsungDeviceStore {
    samsungDevices: SamsungTvDto[];
    loadSamsungDevices: () => Promise<BasicResult>;
    sendKeyPress: (samsungDevice : SamsungTvDto, keypress : SamsungKeypress, type : SamsungKeypressType) => Promise<boolean>;
    loadApps: (deviceId : string) => Promise<void>;
    launchApp: (deviceId : string, appId : string) => Promise<boolean>;
}


const useSamsungDeviceStore = create<SamsungDeviceStore>()(
    devtools(
        immer((set) => {
            let apiClient: TvControlClient | null = null;

            const initializeSamsungClient = (): TvControlClient | null => {
                if (apiClient) return apiClient;
                const token = useTokenStore.getState().token;
                if (!token) return null;
                /*apiClient = new TvControlClient(HOME_SERVER_BASE_URL, {fetch: (url, init) =>
                        authFetch(url,  init,  token)});*/
                apiClient = new TvControlClient(HOME_SERVER_BASE_URL);
                return apiClient;
            };
            
            return ({
                samsungDevices: [] as SamsungTvDto[],
                loadSamsungDevices: async () => {
                    const api = initializeSamsungClient();
                    if (!api)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize Samsung client."
                        } as BasicResult
                    const devices = await api.apiSamsungDevicesGet();
                    const infos = [] as SamsungTvDto[]
                    for (const device of devices) {
                        const req = {
                            deviceId: device.id
                        } as ISamsungDeviceRequest
                        const details = await api.apiSamsungDevicesInfo(new SamsungDeviceRequest(req));
                        if (!details) continue;
                        infos.push(details);
                    }
                    set((draft) => {
                        draft.samsungDevices = infos;
                    })
                    return {
                        isSuccessful: true,
                        error: null
                    } as BasicResult
                },
                loadApps: async (deviceId : string) => {
                    const api = initializeSamsungClient();
                    if (!api)
                        return;
                    const apps = await api.apiSamsungDevicesApps(deviceId);
                },
                sendKeyPress: async (samsungDevice : SamsungTvDto, keypress : SamsungKeypress, type : SamsungKeypressType) => {
                    const api = initializeSamsungClient();
                    if (!api)
                        return false;
                    const req = {
                        deviceId: samsungDevice.id,
                        keypress: keypress,
                        type: type
                    } as ISamsungKeypressRequest;
                    return await api.apiSamsungDevicesKeyPress(new SamsungKeypressRequest(req));
                },
                launchApp: async (deviceId : string, appId : string) => {
                    const api = initializeSamsungClient();
                    if (!api)
                        return false;
                    const req = {
                        deviceId,
                        appId
                    } as ISamsungLaunchAppRequest;
                    return await api.apiSamsungDevicesLaunchApp(new SamsungLaunchAppRequest(req));
                }
            });
        })
    )
);

export default useSamsungDeviceStore;