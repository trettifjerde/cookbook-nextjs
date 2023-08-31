import { ReactNode, useEffect, useState } from "react";
import { LazyMotion, m, domAnimation } from 'framer-motion';
import Spinner from "./Spinner";

export default function PageWrapper({children, className}: {children: ReactNode, className?: string}) {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => setLoading(false), [setLoading]);
    return <LazyMotion features={domAnimation}>
        <m.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}}
            className={className ? className : ''}>
                {children}
        </m.div>
        {isLoading && <Spinner root />}
    </LazyMotion>
    
}