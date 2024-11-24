import {create} from 'zustand'
import {devtools, persist} from 'zustand/middleware'
import {immer} from 'zustand/middleware/immer'
import useTokenStore from "./useTokenStore";
import {HOME_SERVER_BASE_URL} from "../constants.ts";
import {RokuApi} from "../apis/roku-api.ts";
import {ProcessedRokuApp, RokuDevice, RokuKeypress} from "../models/roku-types.ts";
import {BasicResult} from "../models/global-types.ts";
import {displayAppIcon} from "../utility.ts";


export interface RokuDeviceStore {
    rokuDevices: RokuDevice[];
    loadRokuDevices: () => Promise<BasicResult>;
    sendKeyPress: (rokuDevice : RokuDevice, keypress : RokuKeypress, addData: string | null) => Promise<boolean>;
}


const useRokuDeviceStore = create<RokuDeviceStore>()(
    devtools(
        persist(
            immer((set) => {
                let apiClient: RokuApi | null = null;

                const initializeRokuClient = (): RokuApi | null => {
                    if (apiClient) return apiClient;
                    const token = useTokenStore.getState().token;
                    if (!token) return null;
                    apiClient = new RokuApi(token, HOME_SERVER_BASE_URL);
                    return apiClient;
                };


                return ({
                    rokuDevices: [] as RokuDevice[],
                    loadRokuDevices: async () => {
                        const api = initializeRokuClient();
                        if (!api)
                            return {
                                isSuccessful: false,
                                error: "Unable to initialize Roku client."
                            } as BasicResult

                        const devices = await api.scanForRokuDevices();
                        const infos = [] as RokuDevice[]
                        for (const ip of devices) {
                            const details = await api.getDeviceInfo(ip);
                            const apps = await api.getInstalledApps(ip);
                            const processed = [] as ProcessedRokuApp[];
                            if (apps?.appList) {
                                for (const app of apps.appList) {
                                    const blob = await api.getRokuAppIcon(ip, app.id)
                                    const url = await displayAppIcon(blob);
                                    processed.push({rokuApp: app, imgUrl: url});
                                }
                            }

                            if (!details) continue;
                            infos.push({details, ip, apps: processed});
                        }
                        set((draft) => {
                            draft.rokuDevices = infos;
                        })
                        return {
                            isSuccessful: true,
                            error: null
                        } as BasicResult
                    },
                    sendKeyPress: async (rokuDevice : RokuDevice, keyPress : RokuKeypress, addData: string | null) => {
                        const api = initializeRokuClient();
                        if (!api)
                            return false;
                        return await api.sendKeyPress(rokuDevice.ip, keyPress, addData)
                    }
                });
            }),
            {
                name: "roku-store"
            }
        )
    )
);

export default useRokuDeviceStore;