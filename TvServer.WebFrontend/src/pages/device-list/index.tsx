import Loading from "../../loading.tsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import useSTDeviceStore, {STDevice} from "../../stores/useSTDeviceStore.ts";
import useRokuDeviceStore from "../../stores/useRokuDeviceStore.ts";
import StyledButton from "../../components/styled-button.tsx";
import {RokuDevice} from "../../models/roku-types.ts";
import refreshIcon from "../../assets/refresh.svg"

const DeviceList = () => {
    const [rokuLoading, setRokuLoading] = useState<boolean>(true);
    const [STLoading, setSTLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const {stDevices, loadSTDevices} = useSTDeviceStore();
    const {rokuDevices, loadRokuDevices} = useRokuDeviceStore();
    useEffect(() => {
        handleLoadSTDevices()
        handleLoadRokuDevices(false)
    }, [])

    const handleLoadRokuDevices = async (override : boolean) => {
        if (rokuDevices.length && !override) {
            setRokuLoading(false);
            return;
        };
        setRokuLoading(true);
        await loadRokuDevices()
        setRokuLoading(false);

    }
    const handleLoadSTDevices = async () => {
        setSTLoading(true);
        await loadSTDevices()
        setSTLoading(false);
    }

    const selectSTDevice = (d : STDevice) => {
        navigate(`/st-devices/${d.device.deviceId}`)
    }

    const selectRokuDevice = (d : RokuDevice) => {
        navigate(`/roku-devices/${d.details.deviceId}`)
    }


    const getStatusColor = (status : boolean | null) => {
        if (status === null)
            return "bg-slate-500";
        return status ? "bg-green-500" : "bg-red-500";
    }


    return (
        <div className="flex flex-col min-h-screen w-full p-1 bg-slate-100">
            <div>
                <h1 className="text-3xl font-bold">
                    Kyles Super Cool Remote Type System
                </h1>
            </div>
            <div className={"grid lg:grid-cols-2 md:grid-cols-1 p-4 gap-4 items-center justify-center"}>
                <div className={"border-black bg-slate-200 flex flex-col min-h-full shadow p-3 rounded"}>
                    <h3 className={"text-3xl font-bold"}>Samsung</h3>
                    <div className={"flex mt-3 gap-3"}>
                        {
                            STLoading ? (
                                    <div className={"flex flex-1 items-center justify-center"}>
                                        <Loading/>
                                    </div>
                                ) :
                                (
                                    stDevices.map((device, index) => (
                                        <div
                                            onClick={() => selectSTDevice(device)}
                                            className={"w-[150px] h-[120px] p-2 border shadow" +
                                            " rounded bg-white flex flex-col cursor-pointer" +
                                            " hover:scale-105 active:scale-95"} key={index}>
                                            <div className={"h-5 flex justify-end"}>
                                                <div
                                                    className={`w-4 h-4 ${getStatusColor(device.status)} rounded-full shadow border`}/>
                                            </div>
                                            <div
                                                className={"flex flex-1 items-center justify-center"}>
                                                <label className={"pointer-events-none"}>{device.device.name}</label>
                                            </div>
                                        </div>

                                    ))
                                )
                        }
                    </div>

                </div>
                <div className={"border-black bg-slate-200 flex flex-col min-h-full shadow p-3 rounded"}>
                    <div className={"flex w-full justify-between"}>
                        <h3 className={"text-3xl font-bold"}>Roku</h3>
                        <img
                            onClick={() => handleLoadRokuDevices(true)}
                            className={"hover:opacity-80 active:scale-95 cursor-pointer"}
                            src={refreshIcon} width={30} height={30} />
                    </div>
                    <div className={"flex flex-1 mt-3 gap-3"}>
                        {
                            rokuLoading ? (
                                    <div className={"flex flex-1 items-center justify-center"}>
                                        <Loading/>
                                    </div>
                                ) :
                                rokuDevices.length ?
                                    (
                                        rokuDevices.map((device, index) => (
                                            <div
                                                onClick={() => selectRokuDevice(device)}

                                                className={"w-[150px] h-[120px] p-2 border shadow" +
                                                " rounded bg-white flex flex-col cursor-pointer" +
                                                " hover:scale-105 active:scale-95"} key={index}>
                                                <div className={"h-5 flex justify-end"}>
                                                    <div
                                                        className={`w-4 h-4 ${getStatusColor(device.details.powerMode == "PowerOn")} rounded-full shadow border`}/>
                                                </div>
                                                <div
                                                    className={"flex flex-1 items-center justify-center"}>
                                                    <label className={"pointer-events-none"}>{device.details.friendlyDeviceName}</label>
                                                </div>
                                            </div>

                                        ))
                                    )
                                    :
                                    (
                                        <div className={"flex flex-1 flex-col items-center justify-center"}>
                                            <h2 className={"text-gray-400 italic"}>No Roku Devices Found</h2>
                                            <StyledButton className={"mt-3"}>
                                                Search Again
                                            </StyledButton>
                                        </div>
                                    )
                        }
                    </div>

                </div>
            </div>

        </div>
    );
};

export default DeviceList;