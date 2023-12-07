import { ReactNode } from "react";

export default function NavLi({children}: {children: ReactNode}) {
    return <li className="bg-red-300">{children}</li>
}