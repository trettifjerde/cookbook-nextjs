import Link from 'next/link';
import ControlPanel from '../ControlPanel';
import NavLink from './NavLink';
import { Suspense } from 'react';
import MiniSpinner from '../MiniSpinner/MiniSpinner';
import NavLi from './NavLi';

export default function Navigation() {

    return <nav className="flex flex-row items-center gap-4">
        <div>
            <Link className="text-xl" href="/">Cookbook</Link>
        </div>
        <ul className="w-full border-b border-solid border-gray-300 flex flex-row items-center">
            <NavLink url='/recipes' name="Recipes" />

            <Suspense fallback={<NavLi><MiniSpinner/></NavLi>}>
                <ControlPanel />
            </Suspense>
            
        </ul>
    </nav>
}