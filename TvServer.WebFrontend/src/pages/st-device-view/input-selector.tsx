import gameIcon from "../../assets/console.svg"
import hdmiIcon from "../../assets/hdmi.svg"
import pcIcon from "../../assets/pc.svg"
import {SmartThingsInputMap} from "../../models/smart-thing-types.ts";

type InputSelectorProps = {
    activeInput: string | null;
    inputOptions: SmartThingsInputMap[];
    changeInput: (value: string) => void;
}
const InputSelector = ({activeInput, inputOptions, changeInput} : InputSelectorProps) => {


    const getPicture = (itemName : string) => {
        const width = 50;
        const height = 50;
        const searchString = itemName.toLowerCase();
        if (searchString.includes("nintendo"))
            return (
                <img className={"select-none pointer-events-none"} src={"/images/switch.png"} width={width} height={height}/>
            )
        if (searchString.includes("xbox"))
            return (
                <img className={"select-none pointer-events-none"} src={"/images/xbox.jpg"} width={width} height={height}/>
            )
        if (searchString.includes("playstation"))
            return (
                <img className={"select-none pointer-events-none"} src={"/images/playstation.png"} width={width} height={height}/>
            )
        if (searchString.includes("game"))
            return (
                <img className={"select-none pointer-events-none"} src={gameIcon} width={width} height={height}/>
            )
        if (searchString.includes("pc"))
            return (
                <img className={"select-none pointer-events-none"} src={pcIcon} width={width} height={height}/>
            )
        return (
            <img className={"select-none pointer-events-none"} src={hdmiIcon} width={width} height={height}/>

        )
    }

    const selectedStyles = (itemId : string) => {
        if (itemId === activeInput) {
            return "bg-green-100"
        }
        return "";
    }

    const filterSelectedDevices = () => {
        return inputOptions.filter(x => x.id !== "dtv")
    }

    const renderInputSelections = () => {
        return filterSelectedDevices()?.map((item, index) => (
            <div
                onClick={() => changeInput(item.id)}
                className={"cursor-pointer hover:opacity-90 active:scale-95 p-2 border flex border-gray-300" +
                    " shadow justify-between " + selectedStyles(item.id)} key={index}>
                <div className={"flex flex-col pointer-events-none"}>
                    <label>
                        {item.id}
                    </label>
                    <label className={"text-sm text-gray-600"}>
                        {item.name}
                    </label>
                </div>
                {
                    getPicture(item.name)
                }
            </div>

        ))
    }


    return (
        <div className={"my-4 gap-2 grid grid-cols-2"}>
            {
                renderInputSelections()
            }
        </div>
    );
};

export default InputSelector;