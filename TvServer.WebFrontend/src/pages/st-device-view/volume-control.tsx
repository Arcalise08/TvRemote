import Plus from "../../assets/plus.svg"
import Minus from "../../assets/minus.svg"
import {useEffect, useRef, useState} from "react";

type VolumeControlProps = {
    volume: number;
    setTvVolume: (volume: number) => void;
}
const VolumeControl = (
    {volume, setTvVolume}: VolumeControlProps
) => {
    const [value, setValue] = useState<string>("0")
    const timeout = useRef<number | null>(null);
    const mounted = useRef(false);
    useEffect(() => {
        setValue(volume.toString() ?? "0");
    }, []);

    useEffect(() => {
        if (!mounted.current) return;
        setVolume();
    }, [value])

    useEffect(() => {
        mounted.current = true;
    }, [])

    const changeVolumeToClosestFive = (direction: "increment" | "decrement") => {
        let tmpValue = Number(value);
        if (isNaN(tmpValue)) tmpValue = 0;

        if (direction === "increment") {
            tmpValue = Math.ceil(tmpValue / 5) * 5;
            if (tmpValue === Number(value)) tmpValue += 5;
        } else if (direction === "decrement") {
            tmpValue = Math.floor(tmpValue / 5) * 5;
            if (tmpValue === Number(value)) tmpValue -= 5;
        }
        tmpValue = Math.min(100, Math.max(0, tmpValue));
        setValue(tmpValue.toString());
    };

    const setVolume = () => {
        if (value == volume.toString())
            return;
        const time = timeout.current;
        if (time) {
            clearTimeout(time);
            timeout.current = null;
        }
        timeout.current = setTimeout(() => {
            setTvVolume(parseInt(value))
        }, 1000)
    }

    return (
        <div className={"flex flex-1 mt-5"}>
            <div className={"flex flex-1 items-center "}>
                <img
                    onClick={() => changeVolumeToClosestFive("decrement")}
                    className={"cursor-pointer hover:opacity-90 active:scale-95"} src={Minus} width={25} height={25}/>
                <input
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    type="range"
                    className={"flex-1 mx-2"}
                />
                <img
                    onClick={() => changeVolumeToClosestFive("increment")}
                    className={"cursor-pointer hover:opacity-90 active:scale-95"}src={Plus} width={25} height={25}/>
            </div>
            <div className={"flex  ml-5"}>
                <input
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    type={"number"}
                    className={"inline-block w-36 border border-black shadow rounded p-2 text-center"}/>
            </div>
        </div>
    );
};

export default VolumeControl;