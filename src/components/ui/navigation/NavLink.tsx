'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLi from "./NavLi";

export default function NavLink({name, url}: {name: string, url: string}) {
    const pathname = usePathname();
    
    return <NavLi>
        <Link className={`nav-link ${pathname.startsWith(url) ? 'active' : ''}`} href={url}>{name}</Link>
    </NavLi>
}