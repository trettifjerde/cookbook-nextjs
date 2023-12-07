'use client';
import { AnimatePresence, motion} from "framer-motion";
import { ReactNode, RefObject, memo, useEffect } from "react";

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

export default function Dropdown ({visible, closeDropdown, btn, children}: {
    visible: boolean,
    closeDropdown: () => void, 
    btn: RefObject<HTMLButtonElement>,
    children: ReactNode
}) {

    useEffect(() => {
        if (visible) {
            document.addEventListener('click', (e) => {
                if (e.target && btn.current?.contains(e.target as Node))
                    return;
                else 
                    closeDropdown();
            }, {capture: true, once: true});
        }
    }, [visible]);

    return <div className="dropdown-menu" >
        <AnimatePresence>
            {visible && <motion.div className="dropdown-menu-inner" variants={variants} 
                initial="hidden" exit="hidden" animate="visible">
                    {children}
            </motion.div>}
        </AnimatePresence>
    </div>
}