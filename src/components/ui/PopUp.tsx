import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Alert } from '@/helpers/types';

const classes = {
    base: 'container m-auto px-4 py-3 rounded-md shadow-alert',
    color(isError: boolean) {
        return `${this.base} ${isError ? 'bg-red-light text-red-active' : 'bg-green-light text-green-active'}`
    }
}

export default function PopUp({alert, setPopUp}: {alert: Alert|null, setPopUp: (a: Alert|null) => void}) {
    console.log('Alert');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setPopUp(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [alert, setPopUp]);

    return mounted ? createPortal(
        <AnimatePresence>
            { 
                alert && <motion.div className="absolute bottom-8 left-4 right-4" 
                    initial={{opacity: 0, y: -10}} 
                    animate={{opacity: 1, y: 0}} 
                    exit={{opacity: 0, y: 10}}>
                        <div className={classes.color(alert.isError)}>
                            {alert.message}
                        </div>
                </motion.div>
            }
        </AnimatePresence>, document.body) : 
        null
}