import { ReactNode } from "react";

const classes = {
    base: 'nav-li transition-colors min-w-16 text-center',
    border: 'mb-[-1px] rounded-t-md nav-border',
    selectors: 'last:ml-auto',
    active: 'nav-li-active',
    getClass(isActive: boolean, animate: boolean) {
        return `${this.base} ${this.border} ${this.selectors} ${isActive ? this.active : ''} ${animate ? 'animate-fadeIn' : ''}`
    }
}

export default function NavLi({active=false, animate=false, children}: {active?: boolean, animate?: boolean, children: ReactNode}) {

    return <li className={classes.getClass(active, animate)}>{children}</li>
}