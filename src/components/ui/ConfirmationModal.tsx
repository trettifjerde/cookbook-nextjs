'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, memo, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

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
        if (document?.getElementById('confirmation')) {
            setMounted(true);
        }
    }, []);

    return mounted ? ReactDOM.createPortal(
        <AnimatePresence>
            {visible && <div className="m">
                <motion.div className='m-shadow' 
                    variants={shadowVariants} initial="hidden" exit="hidden" animate="visible"
                    onClick={closeModal}
                    ></motion.div>
                <motion.div className="m-content" 
                    variants={dialogVariants} initial="hidden" exit="hidden" animate="visible"
                    >
                        <div className="m-message">
                            {children}
                        </div>
                        <div className='m-btns'>
                            <button type='button' className='btn btn-success' onClick={onConfirm}>Confirm</button>
                            <button type="button" className='btn btn-outline-success' onClick={closeModal}>Cancel</button>
                        </div>
                </motion.div>
            </div>}
        </AnimatePresence>,
        document.getElementById('confirmation')!) : <></>
}