'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLi from "./NavLi";
import NavLinkText from "./NavLinkText";

export default function NavLink({name, url, icon, animate}: {name: string, url: string, icon?: string, animate?: boolean}) {
    const pathname = usePathname();
    
    return <NavLi active={pathname.includes(url)} animate={animate}>
        <Link className="block text-green whitespace-nowrap" href={url}>
            <NavLinkText icon={icon} text={name}/>
        </Link>
    </NavLi>
}