import {ReactNode} from 'react';

type StyledButtonProps = {
    onClick?: () => void;
    className?: string;
    children?: ReactNode;
}
const StyledButton = (
    {onClick, className, children}: StyledButtonProps

) => {
    return (
        <button
            onClick={onClick}
            className={"bg-black mx-auto text-white rounded p-2 active:scale-90 hover:opacity-80 " + className}>
            {children}
        </button>
    );
};

export default StyledButton;