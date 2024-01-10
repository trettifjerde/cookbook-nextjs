'use client'

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { BtnColor, BtnShape, SpinnerButton } from "./buttons";

export default function SubmitButton({color='green', shape, className, children, title}: {
    color?: BtnColor,
    shape?: BtnShape,
    className?: string, 
    children: ReactNode,
    title?: string
}) 
{
    const {pending} = useFormStatus();

    return <SpinnerButton color={color} shape={shape} className={className} title={title} disabled={pending} pending={pending}>{children}</SpinnerButton>
};