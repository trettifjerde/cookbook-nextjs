'use client';
import { ReactNode, useEffect, useState } from "react";
import Alert from "./Alert";
import Navigation from "./Navigation";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { registerLogIn } from "@/store/complexActions";
import Spinner from "./Spinner";
import { getToken } from "@/helpers/authClient";

export default function LayoutComp({ children }: { children: ReactNode }) {

    const dispatch = useStoreDispatch();
    const isSubmitting = useStoreSelector(state => state.general.isSubmitting);
    const [spinnerVisible, setSpinnerVisible] = useState(false);

    useEffect(() => {
        const tokenInfo = getToken();
        if (tokenInfo) dispatch(registerLogIn(tokenInfo));
    }, [dispatch]);

    useEffect(() => {
        if (isSubmitting) {
            const timer = setTimeout(() => setSpinnerVisible(true), 200);
            return () => clearTimeout(timer);
        }
        else {
            setSpinnerVisible(false);
        }
    }, [isSubmitting, setSpinnerVisible]);

    return <>
        <Navigation />
        <main className='container'>
            {children}
        </main>
        <div id="confirmation" />
        <Alert />
        {spinnerVisible && <Spinner root />}
    </>
}