'use client'

import { ReactNode, memo } from "react";
import { useFormStatus } from "react-dom";
import MiniSpinner from "../MiniSpinner/MiniSpinner";
import styles from './submit-btn.module.scss';

const SubmitButton = memo(({type, className='', children}: {
    type?: 'submit'|'button', 
    className?: string, 
    children: ReactNode
}) => {
    const {pending} = useFormStatus();

    return <div className={styles.cnt}>
        <button type={type} className={className} disabled={pending}>{children}</button>
        {pending && <MiniSpinner absolute />}
    </div>
});

export default SubmitButton;