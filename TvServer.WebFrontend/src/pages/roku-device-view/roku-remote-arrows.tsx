import upArrow from "../../assets/up-arrow.svg"
import downArrow from "../../assets/down-arrow.svg"
import leftArrow from "../../assets/left-arrow.svg"
import rightArrow from "../../assets/right-arrow.svg"
import PressableIcon from "../../components/pressable-icon.tsx";
import {useRef} from "react";
import * as React from "react";

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

    const intervalRef = useRef<number | null>(null);

    const vibrate = (duration: number) => {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    };
    const handlePressStart = (event: React.MouseEvent | React.TouchEvent,  onPress: () => void) => {
        if (intervalRef.current)
            return;
        event.preventDefault();
        onPress();
        console.log("pressing")

        intervalRef.current = setInterval(() => {
            console.log("pressing")
            vibrate(50)
            onPress()
        }, 500);
    };

    // Handle press end
    const handlePressEnd = (onRelease: () => void) => {
        console.log("releasing")
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        onRelease();
    };
    return (
        <div className="border border-black flex flex-1 flex-col aspect-square p-2 m-4 max-w-[450px] rounded shadow">
            <div className="flex flex-1 justify-center items-start">
                <PressableIcon
                    onClick={onUpClick}
                    src={upArrow}
                    imgWidth={50}
                    imgHeight={50}
                    
                />
            </div>
            <div className="flex flex-1">
                <div className="flex justify-center items-center">
                    <PressableIcon
                        onClick={onLeftClick}
                        src={leftArrow}
                        imgWidth={50}
                        imgHeight={50}
                    />
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
                    <PressableIcon
                        onClick={onRightClick}
                        src={rightArrow}
                        imgWidth={50}
                        imgHeight={50}
                    />
                </div>
            </div>
            <div className="flex flex-1 justify-center items-end">
                <PressableIcon
                    onClick={onDownClick}
                    src={downArrow}
                    imgWidth={50}
                    imgHeight={50}
                />
            </div>
        </div>
    );
};

export default RokuRemoteArrows;
