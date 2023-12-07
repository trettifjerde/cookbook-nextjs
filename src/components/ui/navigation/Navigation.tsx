import Link from 'next/link';
import ControlPanel from '../ControlPanel';
import NavLink from './NavLink';
import { Suspense } from 'react';
import MiniSpinner from '../MiniSpinner/MiniSpinner';

export default function Navigation() {

    return <nav className="container mx-auto flex flex-row gap-4 h-20">
        <div className="navbar-header">
            <Link className="navbar-brand" href="/">Cookbook</Link>
        </div>
        <ul className="flex flex-row w-full gap-4 items-center">
            <NavLink url='/recipes' name="Recipes" />

            <Suspense fallback={<li className='nav-link'><MiniSpinner/></li>}>
                <ControlPanel />
            </Suspense>
            
        </ul>
    </nav>
}