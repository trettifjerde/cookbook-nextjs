'use client';

import { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './elements/buttons';

const shadowVariants = {
    hidden: {
        opacity: 0, 
        transition: {
            duration: .3
        }
    },
    visible: {
        opacity: 1,
        transition: {
            duration: .3
        }
    }
};

const dialogVariants = {
    hidden: {
        opacity: 0, 
        y: '-40%',
        transition: {
            type: 'spring',
            stiffness: 300,
            mass: 0.3,
            duration: .2
        }
    },
    visible: {
        opacity: 1, 
        y: '0%',
        transition: {
            type: 'spring',
            stiffness: 300,
            mass: 0.3,
            duration: .2
        }
    }
}

export default function ConfirmationModal ({visible, children, onConfirm, closeModal}: {
    visible: boolean,
    children: ReactNode, 
    onConfirm: () => void, 
    closeModal: () => void, 
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? ReactDOM.createPortal(
        <AnimatePresence>
            {visible && <div className="h-screen px-4 md:px-8 xl:px-20 2xl:px-40 flex flex-col items-center justify-center gap-6 py-4 fixed inset-0 overflow-hidden">
                <motion.div className='absolute inset-0 bg-green-shadow' 
                    variants={shadowVariants} initial="hidden" exit="hidden" animate="visible"
                    onClick={closeModal}
                    ></motion.div>
                <motion.div className="md:min-w-[400px] bg-white border border-green rounded-md p-8" 
                    variants={dialogVariants} initial="hidden" exit="hidden" animate="visible"
                    >
                        <div className="p-8 text-center">
                            {children}
                        </div>
                        <div className='flex flex-row gap-4 justify-center'>
                            <Button type='button' color='green' onClick={onConfirm}>Confirm</Button>
                            <Button type="button" color='greenOutline' onClick={closeModal}>Cancel</Button>
                        </div>
                </motion.div>
            </div>}
        </AnimatePresence>,
        document.getElementById('modal')!) : <></>
}