import { motion} from "framer-motion";
import { ReactNode } from "react";

export default function RecipePageWrapper({children, className}: {children: ReactNode, className?: string}) {
    return <motion.div className={className ? className : ''}
            initial={{opacity: 0, y: -6}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 6}} transition={{duration: .3 }}>
            {children}
        </motion.div>
}