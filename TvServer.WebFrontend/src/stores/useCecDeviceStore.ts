import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import {immer} from 'zustand/middleware/immer'
import useTokenStore from "./useTokenStore";
import {BasicResult} from "../models/global-types.ts";
import {CecApi} from "../apis/cec-api.ts";
import {AsyncTimeout, HOME_SERVER_BASE_URL} from "../constants.ts";

export interface CecDeviceStore {
    turnCecTvOn: () => Promise<BasicResult>;
}


const useCecDeviceStore = create<CecDeviceStore>()(
    devtools(
        immer(() => {
            let cecClient: CecApi | null = null;

            const initializeCecClient = (): CecApi | null => {
                if (cecClient) return cecClient;
                const token = useTokenStore.getState().token;
                if (!token) return null;
                cecClient = new CecApi(token, HOME_SERVER_BASE_URL);
                return cecClient;
            };


            return ({
                turnCecTvOn: async () => {
                    try {
                        const cecClient = initializeCecClient();
                        if (!cecClient)
                            return {
                                isSuccessful: false,
                                error: "Failed to initialize CEC client"
                            } as BasicResult
                        const cecResponse = await cecClient.turnTvOn()
                        await AsyncTimeout(2500);
                        return {
                            isSuccessful: cecResponse,
                            error:  cecResponse ? "Failed to turn on with CEC method" : null
                        } as BasicResult

                    }
                    catch (error) {
                        return {
                            isSuccessful: false,
                            error: error ?? "An error occurred"
                        } as BasicResult
                    }
                }
            });
        })
    )
);

export default useCecDeviceStore;