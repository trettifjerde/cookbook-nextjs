'use client';
import { memo, useCallback, useEffect, useState } from 'react';
import { tryLogOut } from '../store/complexActions';
import { useStoreDispatch, useStoreSelector } from '../store/store';
import Link from 'next/link';
import { generalActions } from '@/store/generalState';
import { logOut } from '@/helpers/authClient';
import { usePathname } from 'next/navigation';
import useAuthenticator from '@/helpers/useAuthenticator';

type LinkType = 'all'| 'authed'| 'unauthed';

type Link = {
    url: string,
    name: string,
    access: LinkType
};

const LINKS : Link[] = [
    {url: '/recipes', name: 'Recipes', access: 'all'},
    {url: '/list', name: 'Shopping List', access: 'authed'},
    {url: '/auth/login', name: 'Sign In', access: 'unauthed'},
];

function getLinksExclude(type: LinkType) {
    return LINKS.filter(link => link.access !== type);
}

function Navigation() {
    const {authenticated, user} = useAuthenticator();
    const dispatch = useStoreDispatch();
    const pathname = usePathname();
    const [links, setLinks] = useState(getLinksExclude('authed'));

    async function logout() {
        const res = await logOut();
        if ('error' in res) {
            dispatch(generalActions.flashToast({text: res.error, isError: true}));
        }
        else {
            dispatch(tryLogOut(user!.timer));
        }
    }

    useEffect(() => {
        if (authenticated) 
            setLinks(getLinksExclude('unauthed'))
        else 
            setLinks(getLinksExclude('authed'))
    }, [authenticated, setLinks]);

    return <nav className="navbar navbar-expand p-3">
        <div className="navbar-header">
            <Link className="navbar-brand" href="/">Cookbook</Link>
        </div>
        <div className="navbar w-100">
            <ul className="nav nav-tabs flex-grow-1">
                {links.map(link =><li key={link.name} className="nav-item">
                    <Link className={`nav-link ${pathname.startsWith(link.url) ? 'active' : ''}`} href={link.url}>{link.name}</Link>
                </li>)}
                {authenticated && <li className="nav-item">
                     <button className="nav-link" onClick={logout}>Log out</button>
                </li>}
            </ul>
        </div>
    </nav>
}

export default memo(Navigation);