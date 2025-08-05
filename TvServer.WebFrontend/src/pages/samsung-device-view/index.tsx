import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Loading from "../../loading.tsx";
import StyledButton from "../../components/styled-button.tsx";
import BackButton from "../../assets/back.svg"
import HomeButton from "../../assets/home.svg"
import MuteButton from "../../assets/volume-mute.svg"
import ExitButton from "../../assets/exit.svg"
import {toast} from "react-toastify";
import VolumeControl from "./volume-control.tsx";
import SamsungRemoteArrows from "./samsung-remote-arrows.tsx";
import PressableIcon from "../../components/pressable-icon.tsx";
import useSamsungDeviceStore from "../../stores/useSamsungDeviceStore.ts";
import {SamsungKeypress, SamsungKeypressType, SamsungTvDto} from "../../apis/TvControlClient.ts";
import AppLaunchCards from "../st-device-view/app-launch-cards.tsx";
import {PowerIcon} from "@heroicons/react/24/solid";

const SamsungDeviceView = () => {
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    
    const params = useParams<string>();
    const navigate = useNavigate();
    const [selectedSamsungDevice, setSelectedSamsungDevice] = useState<SamsungTvDto | null>(null);
    const {
        samsungDevices,
        sendKeyPress,
        launchApp
    } = useSamsungDeviceStore();

    useEffect(() => {
        findDevice()
    }, []);

    const findDevice = async () => {
        setLoading(true);

        const device = samsungDevices.find(x => x?.id == params.deviceId)
        if (!device) {
            setNotFound(true);
            return;
        }
        setSelectedSamsungDevice(device);
        setLoading(false);

    }

    const changeTvPower = async () => {
        setLoading(true);
        if (!selectedSamsungDevice) return;
        const result = await sendPress(SamsungKeypress.KEY_POWER, SamsungKeypressType.Click );
        if (!result) {
            toast.error("Failed to toggle TV power");
            return;
        }
        setLoading(false);
    }


    const handleLaunchApp = async (appId : string) => {
        if (!selectedSamsungDevice || !selectedSamsungDevice.id) return;
        await launchApp(selectedSamsungDevice.id, appId);
    }

    const sendPress = async (press : SamsungKeypress, type : SamsungKeypressType = SamsungKeypressType.Click) => {
        if (!selectedSamsungDevice || !selectedSamsungDevice.id) return;
        return await sendKeyPress(selectedSamsungDevice, press, type);
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

    if (!selectedSamsungDevice)
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <Loading/>
            </div>
        )


    return (
        <div className="flex flex-col min-h-screen w-full p-1 bg-slate-100 relative">
            <div className={"flex-1 flex items-center justify-center"}>
                <div className={"bg-white shadow rounded p-2"}>
                    <div className={"h-50 text-center"}>
                        <h1 className={"font-bold text-4xl"}>{selectedSamsungDevice.deviceName}</h1>
                    </div>
                    <div className={"flex flex-col m-5"}>
                        <div className={"flex justify-center items-center"}>
                            <PowerIcon
                                className={"p-2 shadow border border-gray-400 rounded cursor-pointer active:scale-95 hover:opacity-90"}
                                width={55}
                                       height={55}
                                       onClick={() => changeTvPower()}/>

                        </div>
                        <div className={"flex justify-center"}>
                            <SamsungRemoteArrows
                                onUpClick={() => sendPress(SamsungKeypress.KEY_UP)}
                                onDownClick={() => sendPress(SamsungKeypress.KEY_DOWN)}
                                onRightClick={() => sendPress(SamsungKeypress.KEY_RIGHT)}
                                onLeftClick={() => sendPress(SamsungKeypress.KEY_LEFT)}
                                onOkClick={() => sendPress(SamsungKeypress.KEY_ENTER)}
                            />
                        </div>
                        <div className={"flex justify-around"}>
                            <PressableIcon
                                src={MuteButton}
                                onClick={() => sendPress(SamsungKeypress.KEY_MUTE)}
                                imgWidth={50}
                                imgHeight={50}
                            />
                            <PressableIcon
                                src={ExitButton}
                                onClick={() => sendPress(SamsungKeypress.KEY_TOOLS)}
                                imgWidth={60}
                                imgHeight={60}
                            />
                            <PressableIcon
                                src={HomeButton}
                                onClick={() => sendPress(SamsungKeypress.KEY_HOME)}
                                imgWidth={50}
                                imgHeight={50}
                            />
                            <PressableIcon
                                src={BackButton}
                                onClick={() => sendPress(SamsungKeypress.KEY_RETURN)}
                                imgWidth={50}
                                imgHeight={50}
                            />
                        </div>
                        <VolumeControl
                            incrementVolume={() => sendPress(SamsungKeypress.KEY_VOLUP)}
                            decrementVolume={() => sendPress(SamsungKeypress.KEY_VOLDOWN)}
                        />
                        <AppLaunchCards
                            onClick={(appId) => handleLaunchApp(appId)}
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
                loading && (
                    <div className={"absolute inset-0 bg-[rgba(0,0,0,0.3)] flex flex-col items-center justify-center"}>
                        <div className="flex flex-1 items-center justify-center min-h-screen w-full">
                            <Loading/>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default SamsungDeviceView;
