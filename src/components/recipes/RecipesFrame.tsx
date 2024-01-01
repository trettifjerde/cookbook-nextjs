'use client'

import { ReactNode, useEffect, useState} from "react";
import { usePathname } from "next/navigation";
import { Button, LinkButton } from "../ui/elements/buttons";
import RecipesFilter from "./RecipesFilter";

const classes = {
    base: 'h-full flex flex-col gap-1 md:grid md:grid-rows-auto-full md:gap-4',
    container(open: boolean) {
        return `${this.base} ${open ? 'max-md:[&_article]:hidden' : 'max-md:[&_aside]:hidden'}`
    },
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
    
    return <div className={classes.container(isMobileVisible)}>

        <div className="py-1 md:hidden">
            <Button type="button" color={classes.btnColor(isMobileVisible)} className="w-full" 
                onClick={() => setMobileVisible(prev => !prev)}>{getButtonText(isMobileVisible)}</Button>
        </div>

        <div className={`${isMobileVisible ? 'max-md:flex' : 'max-md:hidden'} flex flex-row max-md:flex-wrap items-center gap-2 md:gap-3`}>
            <LinkButton className="max-md:flex-grow" color="green" url="/recipes/new">New recipe</LinkButton>
            <RecipesFilter/>
        </div>

        {children}
    </div>
}