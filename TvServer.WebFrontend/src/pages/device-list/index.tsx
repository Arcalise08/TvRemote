import Loading from "../../loading.tsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import useRokuDeviceStore from "../../stores/useRokuDeviceStore.ts";
import useSamsungDeviceStore from "../../stores/useSamsungDeviceStore.ts";
import useTokenStore from "../../stores/useTokenStore.ts";
import {DeviceStatus, RokuTvDto, SamsungTvDto} from "../../apis/TvControlClient.ts";
import {ArrowLeftStartOnRectangleIcon, ArrowPathIcon} from "@heroicons/react/24/solid";
import useBasicDeviceStore from "../../stores/useBasicDeviceStore.ts";
import StyledButton from "../../components/styled-button.tsx";
import {setAsyncTimeout} from "../../utility.ts";
import ListContainer from "./list-container.tsx";

const DeviceList = () => {
    const [rokuLoading, setRokuLoading] = useState<boolean>(true);
    const [samsungLoading, setSamsungLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const {rokuDevices, loadRokuDevices} = useRokuDeviceStore();
    const {samsungDevices, loadSamsungDevices} = useSamsungDeviceStore();
    const {broadcastForDevices} = useBasicDeviceStore();
    const {setToken} = useTokenStore();

    useEffect(() => {
        handleLoadSamsungDevices()
        handleLoadRokuDevices()
    }, [])

    const handleLoadRokuDevices = async () => {
        setRokuLoading(true);
        await loadRokuDevices()
        setRokuLoading(false);

    }

    const handleLoadSamsungDevices = async () => {
        setSamsungLoading(true);
        await loadSamsungDevices()
        setSamsungLoading(false);
    }


    const onClickLogout = () => {
        const answer = window.confirm("Are you sure you want to logout?")
        if (!answer) return;
        localStorage.clear();
        setToken(null);
        navigate("/token-required");
    }

    const handleBroadcast = async () => {
        const result = await broadcastForDevices();
        if (!result.isSuccessful) {
            alert("Failed to broadcast for devices: " + result.error);
            return;
        }
        let counter = 0;
        setRokuLoading(true);
        setSamsungLoading(true);
        while (counter < 10) {
            await setAsyncTimeout(2500);
            await loadRokuDevices();
            await loadSamsungDevices();
            if (rokuDevices.length > 0)
                setRokuLoading(false);

            if (samsungDevices.length > 0)
                setSamsungLoading(false);
            counter++;
        }
        setRokuLoading(false);
        setSamsungLoading(false);
    }


    return (
        <div className="flex flex-col min-h-screen w-screen p-1 bg-slate-100">
            <div className={"flex w-full justify-between items center p-2"}>
                <h1 className="text-3xl font-bold">
                    Kyles Remote
                </h1>
                <div className={"flex flex-1 justify-end mr-4 gap-2"}>
                    <ArrowPathIcon
                        onClick={() => handleBroadcast()}
                        width={55} className={"cursor-pointer p-2 border border-gray-400 rounded shadow"}
                    />
                    <ArrowLeftStartOnRectangleIcon
                        onClick={onClickLogout}
                        width={55} className={"cursor-pointer p-2 border border-gray-400 rounded shadow"}/>
                </div>
            </div>
            <div className={"flex flex-col p-4 gap-4"}>
                <ListContainer
                    title={"Roku"}
                    devices={rokuDevices}
                    loading={rokuLoading}
                    handleBroadcast={handleBroadcast}/>
                <ListContainer
                    title={"Samsung"}
                    devices={samsungDevices}
                    loading={samsungLoading}
                    handleBroadcast={handleBroadcast}/>
            </div>

        </div>
    );
};

export default DeviceList;