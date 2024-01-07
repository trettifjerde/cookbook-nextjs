'use client'

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStoreDispatch, useStoreSelector } from '@/store/store';
import { generalActions } from '@/store/general';
import { Alert } from '@/helpers/types';
import { ALERT_TIMEOUT } from '@/helpers/config';

function PopUp() {
    const dispatch = useStoreDispatch();
    const alert = useStoreSelector(state => state.general.alert);
    const timer = useRef<any>(null);
    const popUp = useMemo(() => {
        clearTimeout(timer.current);
        
        if (alert) {
            timer.current = setTimeout(() => dispatch(generalActions.setAlert(null)), ALERT_TIMEOUT);
            return alert;
        }
        else {
            timer.current = null;
            return null;
        }
    }, [alert]);
    

    return <AnimatePresence initial={false}>
        { 
            popUp && <motion.div className="absolute bottom-8 left-4 right-4" 
                initial={{opacity: 0, y: -10}} 
                animate={{opacity: 1, y: 0}} 
                exit={{opacity: 0, y: 10}}>
                    <div className={classes.color(popUp.isError)}>
                        {popUp.message}
                    </div>
            </motion.div>
        }
    </AnimatePresence>
}

export default memo(PopUp);

const classes = {
    base: 'container m-auto px-4 py-3 rounded-md shadow-alert',
    color(isError: boolean) {
        return `${this.base} ${isError ? 'bg-red-light text-red-active' : 'bg-green-light text-green-active'}`
    }
}
