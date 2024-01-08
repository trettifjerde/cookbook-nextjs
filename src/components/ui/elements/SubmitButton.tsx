'use client'

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { BtnColor, BtnShape, SpinnerButton } from "./buttons";

export default function SubmitButton({color='green', shape, className, children}: {
    color?: BtnColor,
    shape?: BtnShape,
    className?: string, 
    children: ReactNode
}) 
{
    const {pending} = useFormStatus();

    return <SpinnerButton color={color} shape={shape} className={className} disabled={pending} pending={pending}>{children}</SpinnerButton>
};