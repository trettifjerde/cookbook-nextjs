'use client';
import { LazyMotion, m, domAnimation } from 'framer-motion';
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

const ConfirmationModal = ({itemName, onConfirm, onClose, question}: {itemName: string, onConfirm: any, onClose: any, question: any}) => {
    return ReactDOM.createPortal(
        <div className="m">
            <LazyMotion features={domAnimation}>
                <m.div className='m-shadow' 
                    variants={shadowVariants} initial="hidden" exit="hidden" animate="visible"
                    onClick={onClose}
                    ></m.div>
                <m.div className="m-content" 
                    variants={dialogVariants} initial="hidden" exit="hidden" animate="visible"
                    >
                        <div className="m-message">
                            {question}
                            <span className='b'>{' ' + itemName}</span>
                            ?
                        </div>
                        <div className='m-btns'>
                            <button type='button' className='btn btn-success' onClick={() => onConfirm()}>Confirm</button>
                            <button type="button" className='btn btn-outline-success' onClick={onClose}>Cancel</button>
                        </div>
                </m.div>
            </LazyMotion>
        </div>,
        document.getElementById('confirmation')!
    )
}

export default ConfirmationModal;