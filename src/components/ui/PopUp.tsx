import { Alert } from '@/helpers/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function PopUp({alert, setPopUp}: {alert: Alert|null, setPopUp: (a: Alert|null) => void}) {
    console.log('Alert');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setPopUp(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert, setPopUp]);

    return mounted ? createPortal(
        <AnimatePresence>
            { 
                alert && <motion.div className="mt-3 alert-cont" 
                    initial={{opacity: 0, y: -10}} 
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 10}}>
                        <div className={`alert container ${alert.isError ? 'alert-danger' : 'alert-success'}`}>{alert.message}</div>
                </motion.div>
            }
        </AnimatePresence>, document.body) : 
        null
}