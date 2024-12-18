import upArrow from "../../assets/up-arrow.svg"
import downArrow from "../../assets/down-arrow.svg"
import leftArrow from "../../assets/left-arrow.svg"
import rightArrow from "../../assets/right-arrow.svg"
import {Button} from "@headlessui/react";
type RemoteArrowsProps = {
    onUpClick: () => void;
    onDownClick: () => void;
    onRightClick: () => void;
    onLeftClick: () => void;
    onOkClick: () => void;
};

const RokuRemoteArrows = ({
                          onUpClick,
                          onDownClick,
                          onRightClick,
                          onLeftClick,
                          onOkClick,
                      }: RemoteArrowsProps) => {


    return (
        <div className="border border-black flex flex-1 flex-col aspect-square p-2 m-4 max-w-[450px] rounded shadow">
            <div className="flex flex-1 justify-center items-start">
                <Button onClick={onUpClick}>
                    <img
                        className="cursor-pointer hover:opacity-95 active:scale-95 select-none pointer-events-none"
                        src={upArrow}
                        width={50}
                    />
                </Button>
            </div>
            <div className="flex flex-1">
                <div className="flex justify-center items-center">
                    <Button onClick={onLeftClick}>
                        <img
                            className="cursor-pointer hover:opacity-95 active:scale-95 select-none pointer-events-none"
                            src={leftArrow}
                            width={50}
                        />
                    </Button>
                </div>
                <div className="flex flex-1 justify-center items-center">
                    <div
                        onClick={onOkClick}
                        className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-95 active:scale-95"
                    >
                        <label className="pointer-events-none">Confirm</label>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <Button onClick={onRightClick}>
                        <img
                            
                            className="cursor-pointer hover:opacity-95 active:scale-95 select-none pointer-events-none"
                            src={rightArrow}
                            width={50}
                        />
                    </Button>
                </div>
            </div>
            <div className="flex flex-1 justify-center items-end">
                <Button onClick={onDownClick}>
                    <img
                        
                        className="cursor-pointer hover:opacity-95 active:scale-95 select-none pointer-events-none"
                        src={downArrow}
                        width={50}
                    />
                </Button>
            </div>
        </div>
    );
};

export default RokuRemoteArrows;
