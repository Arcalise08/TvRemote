import React from 'react';
import {RokuTvDto, SamsungTvDto} from '../../apis/TvControlClient';
import {useNavigate} from "react-router-dom";
import StyledButton from "../../components/styled-button.tsx";
import Loading from "../../loading.tsx";
import ListItem from "./list-item.tsx";

type ListContainerProps = {
    devices: RokuTvDto[] | SamsungTvDto[];
    title : string;
    loading: boolean;
    handleBroadcast: () => void;
}

function ListContainer({devices, title, loading, handleBroadcast} : ListContainerProps) {
    const navigate = useNavigate();

    const navigateRokuDevicePage = (d : RokuTvDto) => {
        navigate(`/roku-devices/${d.id}`)
    }

    const navigateSamsungDevicePage = (d : SamsungTvDto) => {
        navigate(`/samsung-devices/${d.id}`)
    }

    const handleSelectDevice = (d : RokuTvDto | SamsungTvDto) => {
        if (d instanceof RokuTvDto) {
            navigateRokuDevicePage(d);
            return;
        }
        navigateSamsungDevicePage(d);

    }


    return (
        <div className={"border-black bg-slate-200 flex flex-col shadow p-3 rounded overflow-hidden"}>
            <h3 className={"text-3xl font-bold"}>{title}</h3>
            <div className={"flex w-full flex-wrap mt-3 gap-2 md:gap-3"}>

                {
                    devices.map((device, index) => (
                        <ListItem
                            key={device.id}
                            device={device}
                            onClick={handleSelectDevice}
                        />
                    ))
                }
                {
                    loading && (
                        <div
                            className={"w-[150px] h-[120px] p-2 border shadow" +
                                " rounded bg-white flex flex-col"}>
                            <div className={"flex flex-1 items-center justify-center"}>
                                <Loading/>
                            </div>
                        </div>
                    )
                }
                {
                    !devices.length && !loading &&
                    (
                        <div className={"flex flex-1 flex-col items-center justify-center"}>
                            <h2 className={"text-gray-400 italic"}>No {title} Devices Found</h2>
                            <StyledButton
                                onClick={handleBroadcast}
                                className={"mt-3"}>
                                Search Again
                            </StyledButton>
                        </div>
                    )

                }
            </div>
        </div>
    )
}

export default ListContainer;