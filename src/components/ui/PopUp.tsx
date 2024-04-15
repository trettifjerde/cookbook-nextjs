'use client'

import { memo, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStoreDispatch, useStoreSelector } from '@/store/store';
import { generalActions } from '@/store/general';
import { ALERT_TIMEOUT } from '@/helpers/config';
import { AlertType } from '@/helpers/types';

function PopUp() {
    const dispatch = useStoreDispatch();
    const alert = useStoreSelector(state => state.general.alert);

    useEffect(() => {       
        if (alert) {
            const timer = setTimeout(() => dispatch(generalActions.setAlert(null)), ALERT_TIMEOUT);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return <AnimatePresence initial={false}>
        { 
            alert && <motion.div className="absolute container mx-auto bottom-10 left-0 right-0 z-10" 
                initial={{opacity: 0, y: -10}} 
                animate={{opacity: 1, y: 0}} 
                exit={{opacity: 0, y: 10}}>
                    <div className={classes.color(alert.type)}>
                        <i className={classes.icon(alert.type)} />
                        <span>{alert.message}</span>
                    </div>
            </motion.div>
        }
    </AnimatePresence>
}

export default memo(PopUp);

const classes = {
    base: 'max-w-screen-md mx-auto px-4 py-3 rounded-md shadow-alert',
    success: 'bg-green-light text-green-active',
    info: 'bg-cyan-50 text-cyan-900',
    error: 'bg-red-light text-red-active',
    icon(type: AlertType) {
        switch(type) {
            case 'error':
                return 'icon-cross';
            case 'success':
                return 'icon-checkmark';
            case 'info':
                return 'icon-info';
        }
    },
    color(type: AlertType) {
        return `${this.base} ${this[type]}`
    }
}
