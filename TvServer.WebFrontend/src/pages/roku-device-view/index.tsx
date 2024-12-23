import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Loading from "../../loading.tsx";
import StyledButton from "../../components/styled-button.tsx";
import BackButton from "../../assets/back.svg"
import HomeButton from "../../assets/home.svg"
import MuteButton from "../../assets/volume-mute.svg"
import ExitButton from "../../assets/exit.svg"
import {toast} from "react-toastify";
import AppLaunchCards from "./app-launch-cards.tsx";
import useRokuDeviceStore from "../../stores/useSamsungDeviceStore.ts";
import {ProcessedRokuApp, RokuApp, RokuDevice, RokuKeypress} from "../../models/roku-types.ts";
import VolumeControl from "./volume-control.tsx";
import RokuRemoteArrows from "./roku-remote-arrows.tsx";
import PressableIcon from "../../components/pressable-icon.tsx";

const RokuDeviceView = () => {
    const [loading, setLoading] = useState(false);
    const [appsloading, setAppsloading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    
    const params = useParams<string>();
    const navigate = useNavigate();
    const [selectedRokuDevice, setSelectedRokuDevice] = useState<RokuDevice | null>(null);
    const [rokuApps, setRokuApps] = useState<ProcessedRokuApp[]>([]);
    const {
        rokuDevices,
        sendKeyPress,
        loadRokuDeviceApps
    } = useRokuDeviceStore();

    useEffect(() => {
        findDevice()
    }, []);

    const findDevice = async () => {
        const device = rokuDevices.find(x => x.details.deviceId == params.deviceId)
        if (!device) {
            setNotFound(true);
            return;
        }
        setSelectedRokuDevice(device);
        setAppsloading(true);
        const apps = await loadRokuDeviceApps(device.ip);
        if (apps.isSuccessful && apps.data && apps.data.length > 0) 
            setRokuApps(apps.data);
        setAppsloading(false);
    }

    const changeTvPower = async (turnOn: boolean) => {
        setLoading(true);
        if (!selectedRokuDevice) return;
        if (turnOn){
            const result = await sendPress(RokuKeypress.PowerOn);
            if (!result) {
                toast.error("Failed to turn TV on");
                return;
            }
        }
        const result = await sendPress(RokuKeypress.PowerOff);
        if (!result)
            toast.error("Failed to turn TV off");
        setLoading(false);
    }

    const launchApp = async (intention : RokuApp) => {
        if (!selectedRokuDevice) return;
        const result = await sendKeyPress(selectedRokuDevice, RokuKeypress.Launch, intention.id);
        if (!result) {
            toast.error("Failed to launch app");
        }
    }

    const sendPress = async (press : RokuKeypress) => {
        if (!selectedRokuDevice) return;
        return await sendKeyPress(selectedRokuDevice, press, null);
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

    if (!selectedRokuDevice)
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
                        <h1 className={"font-bold text-4xl"}>{selectedRokuDevice.details.friendlyDeviceName}</h1>
                    </div>
                    <div className={"flex flex-col m-5"}>
                        <div className={"flex justify-center"}>
                            <StyledButton
                                onClick={() => changeTvPower(true)}
                                className={"h-10 mx-2 bg-green-500"}>
                                Turn On
                            </StyledButton>
                            <StyledButton
                                onClick={() => changeTvPower(false)}
                                className={"h-10 mx-2 bg-red-500"}>
                                Turn Off
                            </StyledButton>
                        </div>
                        <div className={"flex justify-center"}>
                            <RokuRemoteArrows
                                onUpClick={() => sendPress(RokuKeypress.Up)}
                                onDownClick={() => sendPress(RokuKeypress.Down)}
                                onRightClick={() => sendPress(RokuKeypress.Right)}
                                onLeftClick={() => sendPress(RokuKeypress.Left)}
                                onOkClick={() => sendPress(RokuKeypress.Enter)}
                            />
                        </div>
                        <div className={"flex justify-around"}>
                            <PressableIcon
                                src={MuteButton}
                                onClick={() => sendPress(RokuKeypress.VolumeMute)}
                                imgWidth={50}
                                imgHeight={50}
                            />
                            <PressableIcon
                                src={ExitButton}
                                onClick={() => sendPress(RokuKeypress.Exit)}
                                imgWidth={60}
                                imgHeight={60}
                            />
                            <PressableIcon
                                src={HomeButton}
                                onClick={() => sendPress(RokuKeypress.Home)}
                                imgWidth={50}
                                imgHeight={50}
                            />
                            <PressableIcon
                                src={BackButton}
                                onClick={() => sendPress(RokuKeypress.Back)}
                                imgWidth={50}
                                imgHeight={50}
                            />
                        </div>
                        <VolumeControl
                            incrementVolume={() => sendPress(RokuKeypress.VolumeUp)}
                            decrementVolume={() => sendPress(RokuKeypress.VolumeDown)}
                        />
                        {
                            appsloading ?
                                (
                                    <div className="flex items-center justify-center min-h-screen w-full">
                                        <Loading/>
                                    </div>
                                )
                                :
                                (
                                    <AppLaunchCards
                                        rokuApps={rokuApps}
                                        onClick={(app) => launchApp(app)}
                                    />
                                )
                        }
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

export default RokuDeviceView;
