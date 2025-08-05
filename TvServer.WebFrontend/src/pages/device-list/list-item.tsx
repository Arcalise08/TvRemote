import React from 'react';
import {DeviceStatus, RokuTvDto, SamsungTvDto} from "../../apis/TvControlClient.ts";

type ListItemProps = {
    device : SamsungTvDto | RokuTvDto;
    onClick: (device : SamsungTvDto | RokuTvDto) => void;
}
function ListItem({onClick, device} : ListItemProps) {
    const getStatusColor = (device : RokuTvDto | SamsungTvDto) => {
        let powerMode = null;
        if (device instanceof RokuTvDto) {
            powerMode = device.rokuDeviceInfo?.powerMode;
        }
        if (device instanceof SamsungTvDto) {
            powerMode = device.deviceInfo?.device?.powerState;
        }
        if (!powerMode)
            return "bg-slate-500";
        return powerMode === "on" ? "bg-green-500" : "bg-red-500";
    }
    const getStatusText = (status : DeviceStatus | undefined) => {
        if (status === undefined) return "Unknown";
        switch (status) {
            case DeviceStatus._0:
                return "Online";
            case DeviceStatus._1:
                return "Offline";
            case DeviceStatus._2:
                return "Unknown";
            default:
                return "Unknown";
        }
    }

    return (
        <div
            onClick={() => onClick(device)}
            className={"w-[150px] h-[120px] flex-shrink-0 p-2 border shadow" +
                " rounded bg-white flex-col cursor-pointer" +
                " hover:scale-105 active:scale-95"}>
            <div className={"h-5 flex justify-end"}>
                <div
                    className={`w-4 h-4 ${getStatusColor(device)} rounded-full shadow border`}/>
            </div>
            <div
                className={"flex flex-col flex-1 items-center justify-center"}>
                <p className={"pointer-events-none"}>{device.deviceName}</p>
                <p className={"pointer-events-none text-sm text-gray-300"}>
                    {
                        getStatusText(device.status)
                    }
                </p>

            </div>
        </div>
    );
}

export default ListItem;