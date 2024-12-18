import upArrow from "../../assets/up-arrow.svg"
import downArrow from "../../assets/down-arrow.svg"
import leftArrow from "../../assets/left-arrow.svg"
import rightArrow from "../../assets/right-arrow.svg"
import {useRef} from "react";

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

    // Handle press start
    const handlePressStart = (onPress: () => void) => {
        onPress();
        console.log("pressing")

        intervalRef.current = setInterval(() => {
            console.log("pressing")

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
                <img
                    onMouseDown={() => handlePressStart(onUpPress)}
                    onMouseUp={() => handlePressEnd(onUpRelease)}
                    onMouseLeave={() => handlePressEnd(onUpRelease)}
                    className="cursor-pointer hover:opacity-95 active:scale-95"
                    src={upArrow}
                    width={50}
                />
            </div>
            <div className="flex flex-1">
                <div className="flex justify-center items-center">
                    <img
                        onMouseDown={() => handlePressStart(onLeftPress)}
                        onMouseUp={() => handlePressEnd(onLeftRelease)}
                        onMouseLeave={() => handlePressEnd(onLeftRelease)}
                        className="cursor-pointer hover:opacity-95 active:scale-95"
                        src={leftArrow}
                        width={50}
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
                    <img
                        onMouseDown={() => handlePressStart(onRightPress)}
                        onMouseUp={() => handlePressEnd(onRightRelease)}
                        onMouseLeave={() => handlePressEnd(onRightRelease)}
                        className="cursor-pointer hover:opacity-95 active:scale-95"
                        src={rightArrow}
                        width={50}
                    />
                </div>
            </div>
            <div className="flex flex-1 justify-center items-end">
                <img
                    onMouseDown={() => handlePressStart(onDownPress)}
                    onMouseUp={() => handlePressEnd(onDownRelease)}
                    onMouseLeave={() => handlePressEnd(onDownRelease)}
                    className="cursor-pointer hover:opacity-95 active:scale-95"
                    src={downArrow}
                    width={50}
                />
            </div>
        </div>
    );
};

export default StRemoteArrows;
