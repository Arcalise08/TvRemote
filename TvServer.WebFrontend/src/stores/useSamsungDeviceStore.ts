import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import {immer} from 'zustand/middleware/immer'
import useTokenStore from "./useTokenStore";
import {HOME_SERVER_BASE_URL} from "../constants.ts";
import {BasicResult} from "../models/global-types.ts";
import {SamsungDevice, SamsungKeypress, SamsungKeypressType} from "../models/samsung-direct-types.ts";
import {SamsungApi} from "../apis/samsung-api.ts";


export interface SamsungDeviceStore {
    samsungDevices: SamsungDevice[];
    loadSamsungDevices: () => Promise<BasicResult>;
    sendKeyPress: (samsungDevice : SamsungDevice, keypress : SamsungKeypress, type : SamsungKeypressType) => Promise<boolean>;
    connectSamsungDevice: (ip : string) => Promise<boolean>
}


const useSamsungDeviceStore = create<SamsungDeviceStore>()(
    devtools(
        immer((set) => {
            let apiClient: SamsungApi | null = null;

            const initializeSamsungClient = (): SamsungApi | null => {
                if (apiClient) return apiClient;
                const token = useTokenStore.getState().token;
                if (!token) return null;
                apiClient = new SamsungApi(token, HOME_SERVER_BASE_URL);
                return apiClient;
            };
            
            return ({
                samsungDevices: [] as SamsungDevice[],
                loadSamsungDevices: async () => {
                    const api = initializeSamsungClient();
                    if (!api)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize Samsung client."
                        } as BasicResult
                    const saved = await api.getSavedDevices() ?? [];
                    const devices = await api.scanForSamsungDevices();
                    const uniqueDevices = Array.from(new Set([...saved, ...devices]));
                    
                    const infos = [] as SamsungDevice[]
                    for (const ip of uniqueDevices) {
                        const details = await api.getDeviceInfo(ip);
                        if (!details) continue;
                        infos.push({ip, device: details});
                    }
                    set((draft) => {
                        draft.samsungDevices = infos;
                    })
                    return {
                        isSuccessful: true,
                        error: null
                    } as BasicResult
                },
                connectSamsungDevice: async (ip) => {
                    const api = initializeSamsungClient();
                    if (!api)
                        return false;
                    return await api.connectToDevice(ip) ?? false;
                },
                sendKeyPress: async (samsungDevice : SamsungDevice, keypress : SamsungKeypress, type : SamsungKeypressType) => {
                    const api = initializeSamsungClient();
                    if (!api)
                        return false;
                    return await api.sendKeyPress(samsungDevice.ip, keypress, type)
                }
            });
        })
    )
);

export default useSamsungDeviceStore;