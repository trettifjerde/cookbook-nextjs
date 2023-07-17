'use client';
import { ReactNode, RefObject, useEffect } from "react";
import { CSSTransition } from 'react-transition-group';

export default function Dropdown({isVisible, onBgClick, btn, children}: {
    isVisible: boolean, 
    onBgClick: () => void, 
    btn: RefObject<HTMLButtonElement>,
    children: ReactNode
}) {

    useEffect(() => {
        if (isVisible) {
            document.addEventListener('click', (event) => {
                if (event.target !== btn.current)
                    onBgClick()
            }, {once: true, capture: true})
        }

    }, [isVisible, onBgClick, btn]);

    return (
        <CSSTransition in={isVisible} classNames={{
            enter: 'dd-enter',
            exit: 'dd-exit',
            enterDone: 'dd-open'
        }} timeout={150}>
            <div className="dropdown-menu">
                <div className="dropdown-menu-inner">{children}</div>
            </div>
        </CSSTransition>
    )
}