import { ReactNode } from 'react';
import './Modal.css';

export default function Modal({onClose, children}: {onClose: () => void, children: ReactNode}) {

    return (
        <div className="m">
            <div className='m-shadow' onClick={onClose}></div>
            <div className="m-content">
                {children}
            </div>
        </div>
    )
}