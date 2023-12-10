'use client'

import { ReactNode, useEffect, useState} from "react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/elements/buttons";

const classes = {
    container: (open: boolean) => `h-full grid grid-rows-auto-full gap-4 ${open ? '' : ''}`,
    btnColor: (open: boolean) => open ? 'red' : 'green'
};

function getButtonText(isListVisible: boolean) {
    return isListVisible ? 'Hide recipes' : 'Show recipes';   
}

export default function RecipesFrame({children}: {children: ReactNode}) {
    
    const pathname = usePathname();
    const [isMobileVisible, setMobileVisible] = useState(pathname === '/recipes');

    useEffect(() => {
        setMobileVisible(pathname === '/recipes');
    }, [pathname]);
    
    return (<div className={classes.container(isMobileVisible)}>
        <div className="md:hidden">
            <Button type="button" color={classes.btnColor(isMobileVisible)} className="w-full" 
                onClick={() => setMobileVisible(prev => !prev)}>{getButtonText(isMobileVisible)}</Button>
        </div>
        {children}
    </div>)
}