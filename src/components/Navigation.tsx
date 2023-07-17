'use client';
import { useCallback } from 'react';
import { tryLogOut } from '../store/complexActions';
import { useStoreDispatch } from '../store/store';
import Link from 'next/link';
import useAuthenticator from '@/helpers/useAuthenticator';
import { generalActions } from '@/store/generalState';
import { logOut } from '@/helpers/authClient';

export default function Navigation() {
    const {user, authenticated} = useAuthenticator();
    const dispatch = useStoreDispatch();

    const logout = useCallback(async () => {
        const res = await logOut();
        if ('error' in res) {
            dispatch(generalActions.flashToast({text: res.error, isError: true}));
        }
        else {
            dispatch(tryLogOut(user!.timer));
        }
    }, [dispatch, user]);

    return <nav className="navbar navbar-expand p-3">
        <div className="navbar-header">
            <Link className="navbar-brand" href="/">Cookbook</Link>
        </div>
        <div className="navbar w-100">
            <ul className="nav nav-tabs flex-grow-1">
                <li className="nav-item">
                    <Link className="nav-link" href="/recipes">Recipes</Link>
                </li>
                { authenticated && <li className="nav-item">
                    <Link className="nav-link" href="/list">Shopping List</Link>
                </li>}
            </ul>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    {! authenticated && <Link className="nav-link" href="/auth/login">Sign in</Link>}
                    {authenticated && <button className="nav-link" onClick={logout}>Log out</button> }
                </li>
            </ul>
        </div>
    </nav>
}