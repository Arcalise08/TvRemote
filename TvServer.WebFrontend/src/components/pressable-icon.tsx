import {Button} from "@headlessui/react";
import {MouseEventHandler, TouchEventHandler} from "react";

type PressableIconProps = {
    src : string;
    className?: string;
    imgClassName?: string;
    imgWidth?: number;
    imgHeight?: number;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    onTouchStart?: TouchEventHandler<HTMLButtonElement>;
    onTouchEnd?: TouchEventHandler<HTMLButtonElement>;
    onMouseDown?: MouseEventHandler<HTMLButtonElement>;
    onMouseUp?: MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
}
export default function PressableIcon({src, className, imgClassName, onClick, imgWidth, imgHeight,
                                          onTouchStart, onTouchEnd, onMouseDown, onMouseUp, 
                                          onMouseLeave}: PressableIconProps) {
    const vibrate = (duration: number) => {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    };
    
    return (
        <Button
            className={className}
            onClick={(e) => {
                if (onClick) {
                    onClick(e);
                    vibrate(50)
                }
            }}            
            onTouchStart={(e) => {
                if (onTouchStart) {
                    onTouchStart(e);
                    vibrate(50)
                }
            }}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchEnd={onTouchEnd}
            onMouseLeave={onMouseLeave}
        >
            <img

                className={"cursor-pointer hover:opacity-95 active:scale-95 pointer-events-none select-none " + imgClassName}
                src={src}
                width={imgWidth ?? 50}
                height={imgHeight ?? 50}
            />
        </Button>
    );
};
