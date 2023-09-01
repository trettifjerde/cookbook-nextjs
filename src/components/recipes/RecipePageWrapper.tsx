import { LazyMotion, domAnimation, m } from "framer-motion";
import { ReactNode } from "react";

export default function RecipePageWrapper({children}: {children: ReactNode}) {
    return <LazyMotion features={domAnimation}>
        <m.div initial={{opacity: 0.6, y: -6}} animate={{opacity: 1, y: 0}} transition={{duration: .3 }}>
            {children}
        </m.div>
    </LazyMotion> 
}