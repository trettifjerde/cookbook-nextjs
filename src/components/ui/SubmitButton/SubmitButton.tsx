'use client'

import { ReactNode, memo } from "react";
import { useFormStatus } from "react-dom";
import { SpinnerButton } from "../elements/buttons";

const SubmitButton = memo(({className='', children}: {
    className?: string, 
    children: ReactNode
}) => {
    const {pending} = useFormStatus();

    return <SpinnerButton type="submit" color="green" className={className} disabled={pending} pending={pending}>{children}</SpinnerButton>
});

export default SubmitButton;