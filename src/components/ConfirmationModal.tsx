'use client';
import Modal from './Modal';
import { CSSTransition } from 'react-transition-group';

const ConfirmationModal = ({info, onConfirm, onClose, question}: {info: any, onConfirm: any, onClose: any, question: any}) => {
    return <CSSTransition in={info.visible} timeout={300} classNames="m-trans" mountOnEnter unmountOnExit>
        <Modal onClose={onClose}>
            <div className="m-message">
                {question}
                <span className='b'>{' ' + info.name}</span>
                ?
            </div>
            <div className='m-btns'>
                <button type='button' className='btn btn-success' onClick={() => onConfirm()}>Confirm</button>
                <button type="button" className='btn btn-outline-success' onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    </CSSTransition>;
}

export default ConfirmationModal;