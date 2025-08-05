import {create} from 'zustand'
import {devtools, persist} from 'zustand/middleware'
import {immer} from 'zustand/middleware/immer'
import useTokenStore from "./useTokenStore";
import {HOME_SERVER_BASE_URL} from "../constants.ts";
import {RokuApi} from "../apis/roku-api.ts";
import {ProcessedRokuApp} from "../models/roku-types.ts";
import {BasicResult, Result} from "../models/global-types.ts";
import {displayAppIcon} from "../utility.ts";
import {
    IRokuDeviceRequest,
    IRokuKeypressRequest,
    RokuDeviceRequest, RokuKeypress,
    RokuKeypressRequest,
    RokuTvDto,
    TvControlClient
} from "../apis/TvControlClient.ts";


export interface RokuDeviceStore {
    rokuDevices: RokuTvDto[];
    loadRokuDevices: () => Promise<BasicResult>;
    loadRokuDeviceApps: (ip : string) => Promise<Result<ProcessedRokuApp[]>>
    sendKeyPress: (rokuDevice : RokuTvDto, keypress : RokuKeypress, addData: string | null) => Promise<boolean>;
}


const useRokuDeviceStore = create<RokuDeviceStore>()(
    devtools(
        persist(
            immer((set) => {
                let apiClient: TvControlClient | null = null;

                const initializeRokuClient = (): TvControlClient | null => {
                    if (apiClient) return apiClient;
                    const token = useTokenStore.getState().token;
                    if (!token) return null;
                    /*apiClient = new TvControlClient(HOME_SERVER_BASE_URL, {fetch: (url, init) =>
                            authFetch(url,  init,  token)});*/
                    apiClient = new TvControlClient(HOME_SERVER_BASE_URL);
                    return apiClient;
                };


                return ({
                    rokuDevices: [] as RokuTvDto[],
                    loadRokuDevices: async () => {
                        const api = initializeRokuClient();
                        if (!api)
                            return {
                                isSuccessful: false,
                                error: "Unable to initialize Roku client."
                            } as BasicResult

                        const devices = await api.apiRokuDevicesGet();
                        const infos = [] as RokuTvDto[]
                        for (const device of devices) {
                            const req = {
                                deviceId: device.id
                            } as IRokuDeviceRequest
                            const details = await api.apiRokuDevicesInfo(new RokuDeviceRequest(req));
                            if (!details) continue;
                            infos.push(details);
                        }
                        set((draft) => {
                            draft.rokuDevices = infos;
                        })
                        return {
                            isSuccessful: true,
                            error: null
                        } as BasicResult
                    },
                    loadRokuDeviceApps: async (deviceId : string) => {
                        const api = initializeRokuClient();
                        if (!api)
                            return {
                                isSuccessful: false,
                                error: "Unable to initialize Roku client."
                            } as Result<ProcessedRokuApp[]>
                        const req = {
                            deviceId
                        } as IRokuDeviceRequest;
                        const rokuIconClient = new RokuApi(null, HOME_SERVER_BASE_URL);
                        const apps = await api.apiRokuDevicesApps(new RokuDeviceRequest(req));
                        const processed = [] as ProcessedRokuApp[];
                        if (apps?.appList) {
                            for (const app of apps.appList) {
                                if (!app.id) continue;
                                const blob = await rokuIconClient.getRokuAppIcon(deviceId, app.id)
                                const url = await displayAppIcon(blob);
                                processed.push({rokuApp: app, imgUrl: url});
                            }
                        }  
                        return { isSuccessful:true, data: processed } as Result<ProcessedRokuApp[]>;
                    },
                    sendKeyPress: async (rokuDevice : RokuTvDto, keyPress : RokuKeypress, addData: string | null) => {
                        const api = initializeRokuClient();
                        if (!api)
                            return false;
                        const req = {
                            deviceId: rokuDevice.id,
                            keyPress,
                            addData: addData
                        } as IRokuKeypressRequest
                        return await api.apiRokuDevicesKeyPress(new RokuKeypressRequest(req));
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