import { ReactNode } from "react";

const baseBorder = 'border-x border-t border-solid rounded-t-md hover:border-gray-300';
const selectors = 'last:ml-auto [&_a]:p-3';
const baseClassname = `${baseBorder} mb-[-2px] transition-colors ${selectors}`;
const activeClassname = 'bg-white border-gray-300 border-b-white';

function getClassName(active: boolean) {
    return `${baseClassname} ${active ? activeClassname : 'border-transparent'}`
}

export default function NavLi({active=false, children}: {active?: boolean, children: ReactNode}) {

    return <li className={getClassName(active)}>{children}</li>
}