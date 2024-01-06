'use client'

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { BtnColor, SpinnerButton } from "./buttons";

export default function SubmitButton({color='green', className='', children}: {
    color?: BtnColor
    className?: string, 
    children: ReactNode
}) 
{
    const {pending} = useFormStatus();

    return <SpinnerButton type="submit" color={color} className={className} disabled={pending} pending={pending}>{children}</SpinnerButton>
};