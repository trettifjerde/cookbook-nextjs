import { Suspense } from 'react';
import Link from 'next/link';
import ControlPanel from './ControlPanel';
import NavLink from './NavLink';
import NavLi from './NavLi';
import MiniSpinner from '../elements/misc';

export default function Navigation() {

    return <nav className="mb-4 md:mb-6 flex flex-row items-center gap-5">
        <div>
            <Link className="text-xl" href="/">
                <span className='text-green font-medium text-5xl align-sub'>C</span>
                <span className='max-md:hidden'>ookbook</span>
                <span className='max-md:hidden text-green font-medium text-2xl align-top'>34</span>
            </Link>
        </div>
        <ul className="w-full border-b border-solid border-gray-300 flex flex-row gap-1 items-center">
            <NavLink url='/recipes' icon='icon-recipe' name="Recipes" />

            <Suspense fallback={<NavLi><MiniSpinner/></NavLi>}>
                <ControlPanel />
            </Suspense>
            
        </ul>
    </nav>
}