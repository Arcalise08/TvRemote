import Plus from "../../assets/plus.svg"
import Minus from "../../assets/minus.svg"

type VolumeControlProps = {
    incrementVolume : () => void;
    decrementVolume : () => void;
}
const VolumeControl = ({incrementVolume, decrementVolume} : VolumeControlProps) => {


    return (
        <div className={"flex flex-1 mt-5"}>
            <div className={"flex flex-1 items-center "}>
                <img
                    onClick={() => decrementVolume()}
                    className={"cursor-pointer hover:opacity-90 active:scale-95"} src={Minus} width={25} height={25}/>
                <input
                    disabled={true}
                    value={100}
                    type="range"
                    className={"flex-1 mx-2"}
                />
                <img
                    onClick={() => incrementVolume()}
                    className={"cursor-pointer hover:opacity-90 active:scale-95"} src={Plus} width={25} height={25}/>
            </div>
            <div className={"flex  ml-5"}>
                <input
                    disabled={true}
                    value={"N/A"}
                    className={"inline-block w-36 border border-black shadow rounded p-2 text-center"}/>
            </div>
        </div>
    );
};

export default VolumeControl;