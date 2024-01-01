'use client';
import { ReactNode, RefObject, useEffect } from "react";
import { AnimatePresence, motion} from "framer-motion";

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

export const dropdownItemClass = 'py-2 px-4 whitespace-nowrap hover:text-green transition-colors cursor-pointer';

export default function Dropdown ({visible, closeDropdown, btn, children}: {
    visible: boolean,
    closeDropdown: () => void, 
    btn: RefObject<HTMLDivElement>,
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

    return <div className="absolute right-[-0.5rem] overflow-hidden p-2" >
        <AnimatePresence>
            {visible && <motion.div className="bg-white rounded-md text-black shadow-dd"
                variants={variants} initial="hidden" exit="hidden" animate="visible">
                    {children}
            </motion.div>}
        </AnimatePresence>
    </div>
}