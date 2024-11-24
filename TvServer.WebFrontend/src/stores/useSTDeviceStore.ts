import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import {immer} from 'zustand/middleware/immer'
import {SmartThingsDevice, SmartThingsInputMap, STRemoteButtonValues} from "../models/smart-thing-types.ts";
import useTokenStore from "./useTokenStore";
import {SmartThingsApi} from "../apis/smart-things-api.ts";
import {BasicResult, Result} from "../models/global-types.ts";
import {AsyncTimeout, ST_BASE_URL} from "../constants.ts";

export type STDevice = {
    device: SmartThingsDevice;
    status: boolean | null;
    volume: number | null;
    activeInput: string | null;
    inputOptions: SmartThingsInputMap[];
}
export interface DeviceStore {
  stDevices: STDevice[];
  loadSTDevices: () => Promise<Result<STDevice[]>>;

  turnSTTvOn: (device : STDevice) => Promise<BasicResult>;
  turnSTTvOff: (device : STDevice) => Promise<BasicResult>;

  setTvVolume: (device : STDevice, volume: number) => Promise<BasicResult>;
  toggleSTTvMute: (device : STDevice, shouldMute: boolean) => Promise<BasicResult>;

  sendSTRemotePress: (device : STDevice, remotePress : STRemoteButtonValues) => Promise<BasicResult>;


  launchSTTvApp: (device : STDevice, appId : string) => Promise<BasicResult>;
  changeSTTvInput: (device : STDevice, input : string) => Promise<BasicResult>;
}


const useSTDeviceStore = create<DeviceStore>()(
    devtools(
        immer((set, get) => {
            let apiClient: SmartThingsApi | null = null;

            const initializeSTClient = (): SmartThingsApi | null => {
                if (apiClient) return apiClient;
                const token = useTokenStore.getState().token;
                if (!token) return null;
                apiClient = new SmartThingsApi(token, ST_BASE_URL);
                return apiClient;
            };



            return ({
                stDevices: [] as STDevice[],
                loadSTDevices: async () => {
                    const client = initializeSTClient();
                    if (!client)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize API client."
                        } as Result<STDevice[]>
                    try {
                        const response = await client.loadDevices();
                        if (!response.isSuccessful || !response.data)
                            return {
                                isSuccessful: false,
                                error: response.error ?? "Failed to load devices."
                            } as Result<STDevice[]>

                        const unprocessedDevices = response.data.items;
                        const processedDevices: STDevice[] = [];

                        for (const device of unprocessedDevices) {
                            const statusResult = await client.getDeviceStatus(device.deviceId);
                            let status: boolean | null = null;
                            let volume: number | null = null;
                            let activeInput: string | null = null;
                            let inputOptions: SmartThingsInputMap[] = []
                            if (statusResult.isSuccessful && statusResult.data) {
                                status =
                                    statusResult.data.components.main.switch.switch.value === "on";
                                volume =
                                    statusResult.data.components.main.audioVolume.volume.value;
                                activeInput =
                                    statusResult.data.components.main["samsungvd.mediaInputSource"].inputSource.value;
                                inputOptions =
                                    statusResult.data.components.main["samsungvd.mediaInputSource"].supportedInputSourcesMap.value;
                            }

                            processedDevices.push({ device, status, volume, activeInput, inputOptions });
                        }
                        set((draft) => {
                            draft.stDevices = processedDevices;
                        });
                        return {
                            isSuccessful: true,
                            data: processedDevices,
                        } as Result<STDevice[]>;
                    } catch (error) {
                        console.error("Error loading devices:", error);
                        return {
                            isSuccessful: false,
                            error: error ?? "An unexpected error occurred while loading devices."
                        } as Result<STDevice[]>
                    }
                },
                turnSTTvOn:async (device : STDevice) => {
                    const client = initializeSTClient();
                    if (!client)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize API client."
                        } as BasicResult

                    try {
                        const response = await client.turnTvOn(device.device.deviceId);
                        if (response.isSuccessful) {
                            await AsyncTimeout(1500);
                            await get().loadSTDevices()
                        }
                        return {
                            isSuccessful: response.isSuccessful,
                            error: response.error,
                        } as BasicResult
                    }
                    catch (error) {
                        return {
                            isSuccessful: false,
                            error: error ?? "An error occurred"
                        } as BasicResult
                    }

                },
                turnSTTvOff: async (device : STDevice) => {
                    const client = initializeSTClient();
                    if (!client)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize API client."
                        } as BasicResult

                    try {
                        const response = await client.turnTvOff(device.device.deviceId);
                        if (response.isSuccessful) {
                            await AsyncTimeout(2500);
                            await get().loadSTDevices()
                        }
                        return {
                            isSuccessful: response.isSuccessful,
                            error: response.error,
                        } as BasicResult
                    }
                    catch (error) {
                        return {
                            isSuccessful: false,
                            error: error ?? "An error occurred"
                        } as BasicResult
                    }
                },
                sendSTRemotePress: async (device : STDevice, press : STRemoteButtonValues) => {
                    const client = initializeSTClient();
                    if (!client)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize API client."
                        } as BasicResult

                    try {
                        const response = await client.sendRemotePress(device.device.deviceId, [press]);
                        return {
                            isSuccessful: response.isSuccessful,
                            error: response.error,
                        } as BasicResult
                    }
                    catch (error) {
                        return {
                            isSuccessful: false,
                            error: error ?? "An error occurred"
                        } as BasicResult
                    }
                },
                setTvVolume: async (device : STDevice, volume: number) => {
                    const client = initializeSTClient();
                    if (!client)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize API client."
                        } as BasicResult

                    try {
                        const response = await client.setTvVolume(device.device.deviceId, volume);
                        console.log(response);
                        if (response.isSuccessful) {
                            await get().loadSTDevices()
                        }
                        return {
                            isSuccessful: response.isSuccessful,
                            error: response.error,
                        } as BasicResult
                    }
                    catch (error) {
                        return {
                            isSuccessful: false,
                            error: error ?? "An error occurred"
                        } as BasicResult
                    }
                },
                toggleSTTvMute: async (device : STDevice, shouldMute: boolean) => {
                    const client = initializeSTClient();
                    if (!client)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize API client."
                        } as BasicResult

                    try {
                        const response = await client.toggleMuteTv(device.device.deviceId, shouldMute);
                        if (response.isSuccessful) {
                            await AsyncTimeout(1500);
                            await get().loadSTDevices()
                        }
                        return {
                            isSuccessful: response.isSuccessful,
                            error: response.error,
                        } as BasicResult
                    }
                    catch (error) {
                        return {
                            isSuccessful: false,
                            error: error ?? "An error occurred"
                        } as BasicResult
                    }
                },
                launchSTTvApp: async (device : STDevice, appId : string) => {
                    const client = initializeSTClient();
                    if (!client)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize API client."
                        } as BasicResult


                    try {
                        const response = await client.launchApp(device.device.deviceId, appId);
                        return {
                            isSuccessful: response.isSuccessful,
                            error: response.error,
                        } as BasicResult
                    }
                    catch (error) {
                        return {
                            isSuccessful: false,
                            error: error ?? "An error occurred"
                        } as BasicResult
                    }
                },
                changeSTTvInput: async (device : STDevice, input : string) => {
                    const client = initializeSTClient();
                    if (!client)
                        return {
                            isSuccessful: false,
                            error: "Unable to initialize API client."
                        } as BasicResult

                    try {
                        const response = await client.changeTvInput(device.device.deviceId, input);
                        if (response.isSuccessful) {
                            await AsyncTimeout(1500);
                            await get().loadSTDevices()
                        }
                        return {
                            isSuccessful: response.isSuccessful,
                            error: response.error,
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

export default useSTDeviceStore;