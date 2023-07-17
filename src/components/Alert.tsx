'use client';
import { useEffect, useState } from 'react';
import { useStoreSelector } from '../store/store';

const Alert = () => {
    const message = useStoreSelector(state => state.general.message);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 5000);
            return () => clearTimeout(timer);
        }
        else setIsVisible(false);
    }, [message]);

    return (
        <>
            { isVisible && message && <div className={`fadeIn mt-3 alert-cont`}>
                <div className={`alert container ${ message.isError ? 'alert-danger' : 'alert-success'}`}>{message.text}</div>
            </div>
            }
        </>
    )
}

export default Alert;