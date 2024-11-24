import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useSTDeviceStore, {STDevice} from "../../stores/useSTDeviceStore.ts";
import Loading from "../../loading.tsx";
import StyledButton from "../../components/styled-button.tsx";
import BackButton from "../../assets/back.svg"
import HomeButton from "../../assets/home.svg"
import MuteButton from "../../assets/volume-mute.svg"
import ExitButton from "../../assets/exit.svg"
import {toast} from "react-toastify";
import AppLaunchCards from "./app-launch-cards.tsx";
import VolumeControl from "./volume-control.tsx";
import InputSelector from "./input-selector.tsx";
import RemoteArrows from "../../components/remote-arrows.tsx";
import {STRemoteButtonValues} from "../../models/smart-thing-types.ts";
import useCecDeviceStore from "../../stores/useCecDeviceStore.ts";
import {CecTVDeviceId} from "../../apis/cec-api.ts";

const STDeviceView = () => {
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [showCecModal, setShowCecModal] = useState(false);
    const params = useParams<{ deviceId : string }>();
    const navigate = useNavigate();
    const [selectedSTDevice, setSelectedSTDevice] = useState<STDevice | null>(null);
    const {
        turnSTTvOn,
        turnSTTvOff,
        sendSTRemotePress,
        toggleSTTvMute,
        launchSTTvApp,
        changeSTTvInput,
        setTvVolume,
        stDevices
    } = useSTDeviceStore();
    const {turnCecTvOn} = useCecDeviceStore()

    useEffect(() => {
        findDevice()
    }, []);

    const findDevice = () => {
        const device = stDevices.find(x => x.device.deviceId == params.deviceId)
        if (!device) {
            setNotFound(true);
            return;
        }
        setSelectedSTDevice(device);
    }
    const changeTvPower = async (turnOn: boolean) => {
        setLoading(true);
        if (!selectedSTDevice) return;
        if (turnOn){
            const result = await turnSTTvOn(selectedSTDevice);
            if (!result.isSuccessful) {
                toast.error(result.error ?? "Failed to turn TV on");
                console.log(selectedSTDevice.device.deviceId);
                if (selectedSTDevice.device.deviceId === CecTVDeviceId) {
                    setShowCecModal(true);

                }
            }
            setLoading(false);

            return;
        }
        const result = await turnSTTvOff(selectedSTDevice);
        if (!result.isSuccessful)
            toast.error(result.error ?? "Failed to turn TV off");
        setLoading(false);
    }

    const forceCecTurnOn = async () => {
        setLoading(true);
        try {
            await turnCecTvOn();
        }catch {
            toast.error("Failed to force TV on");
            return;
        }
        setShowCecModal(false);
        setLoading(false);
    }

    const launchApp = async (appId : string) => {
        if (!selectedSTDevice) return;

        const result = await launchSTTvApp(selectedSTDevice, appId);
        console.log(result);
        if (!result.isSuccessful) {
            toast.error(result.error ?? "Failed to turn TV on");
        }
    }

    const sendPress = async (press : STRemoteButtonValues) => {
        if (!selectedSTDevice) return;
        await sendSTRemotePress(selectedSTDevice, press);
    }

    if (notFound)
        return (
            <div className="flex items-center justify-center min-h-screen w-full bg-slate-100">
                <div className={"bg-white shadow rounded p-2"}>
                    <h3>
                        Unable to find device. Please try again later.
                    </h3>
                    <div
                        className={"mt-4 w-full flex justify-center items-center"}>
                        <StyledButton
                            className={"w-1/3"}
                            onClick={() => navigate("/devices")}>
                            Go Back
                        </StyledButton>
                    </div>
                </div>
            </div>
        )

    if (!selectedSTDevice)
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <Loading/>
            </div>
        )


    return (
        <div className={"flex flex-1 h-screen w-full bg-slate-100 relative overflow-hidden"}>
            <div className="flex flex-col h-full w-full overflow-auto">
                <div className={"flex-1 flex items-center justify-center"}>
                    <div className={"bg-white shadow rounded p-2"}>
                        <div className={"h-50 text-center"}>
                            <h1 className={"font-bold text-4xl"}>{selectedSTDevice.device.label}</h1>
                        </div>
                        <div className={"flex flex-col m-5"}>
                            <div className={"flex justify-center"}>
                                <StyledButton
                                    onClick={() => changeTvPower(true) }
                                    className={"h-10 mx-2 bg-green-500"}>
                                    Turn On
                                </StyledButton>
                                <StyledButton
                                    onClick={() => changeTvPower(false) }
                                    className={"h-10 mx-2 bg-red-500"}>
                                    Turn Off
                                </StyledButton>
                            </div>
                            <div className={"flex justify-center"}>
                                <RemoteArrows
                                    onUpClick={() => sendPress(STRemoteButtonValues.Up)}
                                    onDownClick={() => sendPress(STRemoteButtonValues.Down)}
                                    onRightClick={() => sendPress(STRemoteButtonValues.Right)}
                                    onLeftClick={() => sendPress(STRemoteButtonValues.Left)}
                                    onOkClick={() => sendPress(STRemoteButtonValues.Ok)}
                                 />
                            </div>
                            <div className={"flex justify-around"}>
                                <img
                                    onClick={() => toggleSTTvMute(selectedSTDevice, true)}
                                    className={"cursor-pointer hover:opacity-95 active:scale-95"}
                                    src={MuteButton} width={50} height={50}/>
                                <img
                                    onClick={() => sendPress(STRemoteButtonValues.Exit)}
                                    className={"cursor-pointer hover:opacity-95 active:scale-95"}
                                    src={ExitButton} width={60} height={60}/>
                                <img
                                    onClick={() => sendPress(STRemoteButtonValues.Home)}
                                    className={"cursor-pointer hover:opacity-95 active:scale-95"}
                                    src={HomeButton} width={50} height={50}/>
                                <img
                                    onClick={() => sendPress(STRemoteButtonValues.Back)}
                                    className={"cursor-pointer hover:opacity-95 active:scale-95"}
                                    src={BackButton} width={50} height={50}/>
                            </div>
                            <VolumeControl
                                volume={selectedSTDevice.volume ?? 0}
                                setTvVolume={(volume) => setTvVolume(selectedSTDevice, volume)}
                            />
                            <InputSelector
                                inputOptions={selectedSTDevice.inputOptions}
                                activeInput={selectedSTDevice.activeInput}
                                changeInput={(input) => changeSTTvInput(selectedSTDevice, input)}
                            />
                            <AppLaunchCards
                                onClick={(appId) => launchApp(appId)}
                            />
                        </div>
                        <div className={"bg-gray-100 border p-2 rounded"}>
                            <StyledButton onClick={() => navigate("/devices")}>
                                Go Back
                            </StyledButton>
                        </div>
                    </div>

                </div>

                {
                    showCecModal && (
                        <div className={"absolute inset-0 bg-[rgba(0,0,0,0.3)] flex flex-col items-center justify-center"}>
                            <div className="flex flex-col items-center w-[90%] sm:w-1/3 justify-center bg-white p-4 rounded shadow">
                                <p className={"text-center"}>
                                    The TV has failed to turn on. However this TV is CEC capable.
                                </p>
                                <p className={"text-center mt-4 font-bold"}>Would you like to attempt to turn
                                    the TV on using CEC?
                                </p>
                                <div className={"grid grid-cols-2 gap-4 mt-4 w-full"}>
                                    <StyledButton
                                        onClick={() => forceCecTurnOn()}
                                        className={"bg-green-500 w-full"}>
                                        Yes
                                    </StyledButton>
                                    <StyledButton
                                        onClick={() => setShowCecModal(false)}
                                        className={"bg-red-500 w-full"}>
                                        No
                                    </StyledButton>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    loading && (
                        <div className={"absolute inset-0 bg-[rgba(0,0,0,0.3)] flex flex-col items-center justify-center"}>
                            <div className="flex flex-1 items-center justify-center min-h-screen w-full">
                                <Loading/>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default STDeviceView;