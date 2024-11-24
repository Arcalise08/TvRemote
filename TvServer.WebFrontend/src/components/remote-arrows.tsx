import upArrow from "../assets/up-arrow.svg"
import downArrow from "../assets/down-arrow.svg"
import leftArrow from "../assets/left-arrow.svg"
import rightArrow from "../assets/right-arrow.svg"

type RemoteArrowsProps = {
    onUpClick: () => void
    onDownClick: () => void
    onRightClick: () => void
    onLeftClick: () => void
    onOkClick: () => void
}
const RemoteArrows = ({onUpClick, onDownClick, onRightClick, onLeftClick, onOkClick} : RemoteArrowsProps) => {
    return (
        <div className={"border border-black flex flex-1 flex-col aspect-square p-2 m-4 max-w-[450px] rounded shadow"}>
            <div className="flex flex-1 justify-center items-start">
                <img onClick={() => onUpClick()} className={"cursor-pointer hover:opacity-95 active:scale-95"} src={upArrow} width={50}/>
            </div>
            <div className={"flex flex-1"}>
                <div className={"flex justify-center items-center"}>
                    <img onClick={() => onLeftClick()}
                         className={"cursor-pointer hover:opacity-95 active:scale-95"} src={leftArrow} width={50}/>
                </div>
                <div className={"flex flex-1 justify-center items-center"}>
                    <div
                        onClick={() => onOkClick()}
                        className={"w-24 h-24 bg-black text-white rounded-full flex items-center justify-center " +
                            "cursor-pointer hover:opacity-95 active:scale-95"}>
                        <label className={"pointer-events-none"}>
                            Confirm
                        </label>
                    </div>
                </div>
                <div className={"flex justify-center items-center"}>
                    <img onClick={() => onRightClick()}
                         className={"cursor-pointer hover:opacity-95 active:scale-95"} src={rightArrow} width={50}/>
                </div>
            </div>
            <div className="flex flex-1 justify-center items-end">
                <img onClick={() => onDownClick()}
                     className={"cursor-pointer hover:opacity-95 active:scale-95"} src={downArrow} width={50}/>
            </div>
        </div>
    );
};

export default RemoteArrows;