'use client'

import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStoreSelector } from '@/store/store';
import { Alert } from '@/helpers/types';

function PopUp() {

    const alert = useStoreSelector(state => state.general.alert);
    const [popUp, setPopUp] = useState<Alert|null>(null);

    useEffect(() => {
        if (alert) {
            setPopUp(alert);
            const timer = setTimeout(() => setPopUp(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return <AnimatePresence>
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
