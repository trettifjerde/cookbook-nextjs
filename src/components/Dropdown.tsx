'use client';
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ReactNode, RefObject, useEffect } from "react";

const variants = {
    hidden: {
        opacity: 0,
        y: '-100%'
    },
    visible: {
        opacity: 1,
        y: 0
    }
}

export default function Dropdown({onBgClick, btn, children}: {
    onBgClick: () => void, 
    btn: RefObject<HTMLButtonElement>,
    children: ReactNode
}) {

    useEffect(() => {
        document.addEventListener('click', (event) => {
            if (event.target !== btn.current)
                onBgClick()
        }, {once: true, capture: true})
    }, [onBgClick, btn]);

    return (
        <div className="dropdown-menu" >
            <LazyMotion features={domAnimation}>
                <m.div className="dropdown-menu-inner"
                    variants={variants} initial="hidden" exit="hidden" animate="visible">
                        {children}
                </m.div>
            </LazyMotion>
        </div>
    )
}