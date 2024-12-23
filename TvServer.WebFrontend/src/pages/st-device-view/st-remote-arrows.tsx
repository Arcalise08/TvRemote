import upArrow from "../../assets/up-arrow.svg"
import downArrow from "../../assets/down-arrow.svg"
import leftArrow from "../../assets/left-arrow.svg"
import rightArrow from "../../assets/right-arrow.svg"
import * as React from "react";
import {useRef} from "react";
import PressableIcon from "../../components/pressable-icon.tsx";
import {IsOnMobile} from "../../utility.ts";

type RemoteArrowsProps = {
    onUpPress: () => void;
    onUpRelease: () => void;
    onUpClick: () => void;
    onDownPress: () => void;
    onDownRelease: () => void
    onDownClick: () => void;
    onRightPress: () => void;
    onRightRelease: () => void;
    onRightClick: () => void;
    onLeftPress: () => void;
    onLeftRelease: () => void;
    onLeftClick: () => void;
    onOkClick: () => void;
};

enum ButtonNames {
    left= "left",
    right= "right",
    up= "up",
    down= "down",
}

const StRemoteArrows = ({
                            onUpPress,
                            onUpRelease,
                            onUpClick,
                            onDownPress,
                            onDownRelease,
                            onDownClick,
                            onRightPress,
                            onRightRelease,
                            onRightClick,
                            onLeftPress,
                            onLeftRelease,
                            onLeftClick,
                            onOkClick,
                        }: RemoteArrowsProps) => {
    const intervalRef = useRef<number | null>(null);
    const pressingRef = useRef<ButtonNames | null>(null);
    const isOnMobile = useRef(IsOnMobile());
    const vibrate = (duration: number) => {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    };


    const handleClick = (
        btnName : ButtonNames,
        onPress: () => void,
        onLongPress: () => void,
        onRelease : () => void
    ) => {
        console.log(`Pressing ${btnName}`)
        
        onPress();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null
        }
        pressingRef.current = btnName;
        let longPressing = false;
        intervalRef.current = setInterval(() => {
            if (pressingRef.current && pressingRef.current === btnName)
            {
                longPressing = true;
                console.log(`long pressing ${pressingRef.current}`);
                onLongPress();
                vibrate(100)
            }
            else {
                if (longPressing) {
                    console.log("clearing long press!")
                    onRelease()
                }
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                } 
                intervalRef.current = null
            }
        }, 500)
    };
    
    
    const handlePressEnd = (btnName : ButtonNames) => {
        pressingRef.current = null;
    };

    return (
        <div className="border border-black flex flex-1 flex-col aspect-square p-2 m-4 max-w-[450px] rounded shadow">
            <div className="flex flex-1 justify-center items-start">
                <PressableIcon
                    src={upArrow}
                    onMouseDown={() =>  isOnMobile.current && handleClick(ButtonNames.up, onUpClick, onUpPress, onUpRelease)}
                    onTouchStart={() =>!isOnMobile.current && handleClick(ButtonNames.up, onUpClick, onUpPress, onUpRelease)}
                    onMouseUp={() => handlePressEnd(ButtonNames.up)}
                    onTouchEnd={()=> handlePressEnd(ButtonNames.up)}
                    onMouseLeave={()=> handlePressEnd(ButtonNames.up)}
                />
            </div>
            <div className="flex flex-1">
                <div className="flex justify-center items-center">
                    <PressableIcon
                        src={leftArrow}
                        onTouchStart={() => isOnMobile.current && handleClick(ButtonNames.left, onLeftClick, onLeftPress, onLeftRelease)}
                        onMouseDown={() => !isOnMobile.current && handleClick(ButtonNames.left, onLeftClick, onLeftPress, onLeftRelease)}
                        onMouseUp={() => handlePressEnd(ButtonNames.left)}
                        onTouchEnd={()=> handlePressEnd(ButtonNames.left)}
                        onMouseLeave={()=> handlePressEnd(ButtonNames.left)}
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
                        onTouchStart={() => isOnMobile.current && handleClick(ButtonNames.right, onRightClick, onRightPress, onRightRelease)}
                        onMouseDown={() => !isOnMobile.current && handleClick(ButtonNames.right, onRightClick, onRightPress, onRightRelease)}
                        onMouseUp={() => handlePressEnd(ButtonNames.right)}
                        onTouchEnd={()=> handlePressEnd(ButtonNames.right)}
                        onMouseLeave={()=> handlePressEnd(ButtonNames.right)}
                    />
                </div>
            </div>
            <div className="flex flex-1 justify-center items-end">
                <PressableIcon
                    src={downArrow}
                    onTouchStart={() => isOnMobile.current && handleClick(ButtonNames.down, onDownClick, onDownPress, onDownRelease)}
                    onMouseDown={() => !isOnMobile.current && handleClick(ButtonNames.down, onDownClick, onDownPress, onDownRelease)}
                    onMouseUp={() => handlePressEnd(ButtonNames.down)}
                    onTouchEnd={()=> handlePressEnd(ButtonNames.down)}
                    onMouseLeave={()=> handlePressEnd(ButtonNames.down)}
                />
            </div>
        </div>
    );
};

export default StRemoteArrows;
