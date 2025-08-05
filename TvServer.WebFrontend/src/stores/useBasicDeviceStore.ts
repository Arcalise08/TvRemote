import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import {immer} from 'zustand/middleware/immer'
import useTokenStore from "./useTokenStore";
import {HOME_SERVER_BASE_URL} from "../constants.ts";
import {BasicResult} from "../models/global-types.ts";
import {TvControlClient} from "../apis/TvControlClient.ts";


export interface BasicDeviceStore {
    broadcastForDevices: () => Promise<BasicResult>;
}


const useBasicDeviceStore = create<BasicDeviceStore>()(
    devtools(
        immer((set) => {
            let apiClient: TvControlClient | null = null;

            const initializeTvControlClient = (): TvControlClient | null => {
                if (apiClient) return apiClient;
                const token = useTokenStore.getState().token;
                if (!token) return null;
                /*apiClient = new TvControlClient(HOME_SERVER_BASE_URL, {fetch: (url, init) =>
                        authFetch(url,  init,  token)});*/
                apiClient = new TvControlClient(HOME_SERVER_BASE_URL);
                return apiClient;
            };
            
            return ({
                broadcastForDevices: async () => {
                    const api = initializeTvControlClient();
                    if (!api)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize Samsung client."
                        } as BasicResult

                    const result = await api.apiBroadcast();
                    return {
                        isSuccessful: !!result,
                        error: "An error occurred while broadcasting for devices."
                    }

                },
            });
        })
    )
);

export default useBasicDeviceStore;