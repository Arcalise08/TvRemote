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
import {SamsungDevice, SamsungKeypress, SamsungKeypressType} from "../../models/samsung-direct-types.ts";

const SamsungDeviceView = () => {
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    
    const params = useParams<string>();
    const navigate = useNavigate();
    const [selectedSamsungDevice, setSelectedSamsungDevice] = useState<SamsungDevice | null>(null);
    const {
        samsungDevices,
        connectSamsungDevice,
        sendKeyPress
    } = useSamsungDeviceStore();

    useEffect(() => {
        findDevice()
    }, []);

    const findDevice = async () => {
        setLoading(true);

        const device = samsungDevices.find(x => x.device.id == params.deviceId)
        if (!device) {
            setNotFound(true);
            return;
        }
        setSelectedSamsungDevice(device);
        const result = await connectSamsungDevice(device.ip);
        if (!result) {
            toast.error("Failed to connect to TV! Kyle will not be happy about this...");
            return;
        }
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

/*    const launchApp = async (intention : RokuApp) => {
        if (!selectedSamsungDevice) return;
        const result = await sendKeyPress(selectedSamsungDevice, RokuKeypress.Launch, intention.id);
        if (!result) {
            toast.error("Failed to launch app");
        }
    }*/

    const sendPress = async (press : SamsungKeypress, type : SamsungKeypressType = SamsungKeypressType.Click) => {
        if (!selectedSamsungDevice) return;
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
                        <h1 className={"font-bold text-4xl"}>{selectedSamsungDevice.device.name}</h1>
                    </div>
                    <div className={"flex flex-col m-5"}>
                        <div className={"flex justify-center items-center"}>
                            <StyledButton
                                onClick={() => changeTvPower()}
                                className={"h-10 mx-2 bg-green-500"}>
                                Power
                            </StyledButton>
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
