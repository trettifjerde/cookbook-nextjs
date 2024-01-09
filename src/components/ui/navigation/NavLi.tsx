import { ReactNode } from "react";

const classes = {
    base: 'transition-colors min-w-16 text-center',
    border: 'mb-[-1px] border-x border-t border-solid rounded-t-md hover:border-gray-300',
    selectors: 'last:ml-auto *:py-3 *:px-4',
    active: 'bg-white border-gray-300 border-b-white',
    inactive: 'border-transparent',
    getClass(isActive: boolean, animate: boolean) {
        return `${this.base} ${this.border} ${this.selectors} ${isActive ? this.active : this.inactive} ${animate ? 'animate-fadeIn' : ''}`
    }
}

export default function NavLi({active=false, animate=false, children}: {active?: boolean, animate?: boolean, children: ReactNode}) {

    return <li className={classes.getClass(active, animate)}>{children}</li>
}