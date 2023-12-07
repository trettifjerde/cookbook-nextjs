'use client'

import { ReactNode, useEffect, useState} from "react";
import { usePathname } from "next/navigation";

export default function RecipesFrame({children}: {children: ReactNode}) {
    
    const pathname = usePathname();
    const [isMobileVisible, setMobileVisible] = useState(pathname === '/recipes');

    useEffect(() => {
        setMobileVisible(pathname === '/recipes');
    }, [pathname]);
    
    return (<div className={`recipes ${isMobileVisible ? 'open': ''}`}>
        <div className="show-recipes-btn mb-2">
            <button type="button" className={`btn w-100 ${isMobileVisible ? 'btn-danger' : 'btn-primary'}`} 
                onClick={() => setMobileVisible(prev => !prev)}>
                { isMobileVisible ? 'Hide recipes' : 'Show recipes'}
            </button>
        </div>
        {children}
    </div>)
}