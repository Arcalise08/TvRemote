import upArrow from "../../assets/up-arrow.svg"
import downArrow from "../../assets/down-arrow.svg"
import leftArrow from "../../assets/left-arrow.svg"
import rightArrow from "../../assets/right-arrow.svg"
import * as React from "react";
import {useRef} from "react";
import PressableIcon from "../../components/pressable-icon.tsx";

type RemoteArrowsProps = {
    onUpPress: () => void;
    onUpRelease: () => void;
    onDownPress: () => void;
    onDownRelease: () => void;
    onRightPress: () => void;
    onRightRelease: () => void;
    onLeftPress: () => void;
    onLeftRelease: () => void;
    onOkClick: () => void;
};

const StRemoteArrows = ({
                          onUpPress,
                          onUpRelease,
                          onDownPress,
                          onDownRelease,
                          onRightPress,
                          onRightRelease,
                          onLeftPress,
                          onLeftRelease,
                          onOkClick,
                      }: RemoteArrowsProps) => {
    const intervalRef = useRef<number | null>(null);
    
    const vibrate = (duration: number) => {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    };
    const handlePressStart = (event: React.MouseEvent | React.TouchEvent,  onPress: () => void) => {
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
                    src={upArrow}
                    onTouchStart={(e) => handlePressStart(e, onUpPress)}
                    onMouseDown={(e) => handlePressStart(e, onUpPress)}
                    onMouseUp={() => handlePressEnd(onUpRelease)}
                    onTouchEnd={() => handlePressEnd(onUpRelease)}
                    onMouseLeave={() => handlePressEnd(onUpRelease)}
                />
            </div>
            <div className="flex flex-1">
                <div className="flex justify-center items-center">
                    <PressableIcon
                        src={leftArrow}
                        onTouchStart={(e) => handlePressStart(e, onLeftPress)}
                        onMouseDown={(e) => handlePressStart(e, onLeftPress)}
                        onMouseUp={() => handlePressEnd(onLeftRelease)}
                        onMouseLeave={() => handlePressEnd(onLeftRelease)}
                        onTouchEnd={() => handlePressEnd(onLeftRelease)}
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
                        src={rightArrow}
                        onTouchStart={(e) => handlePressStart(e, onRightPress)}
                        onMouseDown={(e) => handlePressStart(e, onRightPress)}
                        onTouchEnd={() => handlePressEnd(onRightRelease)}
                        onMouseUp={() => handlePressEnd(onRightRelease)}
                        onMouseLeave={() => handlePressEnd(onRightRelease)}
                    />
                </div>
            </div>
            <div className="flex flex-1 justify-center items-end">
                <PressableIcon 
                    src={downArrow}
                    onTouchStart={(e) => handlePressStart(e, onDownPress)}
                    onMouseDown={(e) => handlePressStart(e, onDownPress)}
                    onMouseUp={() => handlePressEnd(onDownRelease)}
                    onTouchEnd={() => handlePressEnd(onDownRelease)}
                    onMouseLeave={() => handlePressEnd(onDownRelease)}
                />
            </div>
        </div>
    );
};

export default StRemoteArrows;
