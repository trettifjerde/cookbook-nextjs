import { Suspense } from 'react';
import Link from 'next/link';
import ControlPanel from '../ControlPanel';
import NavLink from './NavLink';
import NavLi from './NavLi';
import MiniSpinner from '../elements/misc';

export default function Navigation() {

    return <nav className="flex flex-row items-center gap-4 md:gap-8">
        <div className='max-[400px]:hidden'>
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