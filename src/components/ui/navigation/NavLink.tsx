'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLi from "./NavLi";

export default function NavLink({name, url}: {name: string, url: string}) {
    const pathname = usePathname();
    
    return <NavLi active={pathname.includes(url)}>
        <Link className="block text-green" href={url}>{name}</Link>
    </NavLi>
}