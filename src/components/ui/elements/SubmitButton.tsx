'use client'

import { ReactNode, memo } from "react";
import { useFormStatus } from "react-dom";
import { BtnColor, SpinnerButton } from "./buttons";

const SubmitButton = memo(({color='green', className='', children}: {
    color?: BtnColor
    className?: string, 
    children: ReactNode
}) => {
    const {pending} = useFormStatus();

    return <SpinnerButton type="submit" color={color} className={className} disabled={pending} pending={pending}>{children}</SpinnerButton>
});

export default SubmitButton;