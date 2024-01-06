import { Suspense } from 'react';
import Link from 'next/link';
import ControlPanel from './ControlPanel';
import NavLink from './NavLink';
import NavLi from './NavLi';
import MiniSpinner from '../elements/misc';

export default function Navigation() {

    return <nav className="mb-4 md:mb-6 flex flex-row items-center gap-2 md:gap-4 lg:gap-6">
        <div className='max-[450px]:hidden'>
            <Link className="text-xl" href="/">Cookbook</Link>
        </div>
        <ul className="w-full border-b border-solid border-gray-300 flex flex-row gap-1 items-center">
            <NavLink url='/recipes' name="Recipes" />

            <Suspense fallback={<NavLi><MiniSpinner/></NavLi>}>
                <ControlPanel />
            </Suspense>
            
        </ul>
    </nav>
}