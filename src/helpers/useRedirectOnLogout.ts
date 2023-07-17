'use client';
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useRedirectOnLogout = () => {
    const router = useRouter();
    const user = useStoreSelector(state => state.general.user);
    const dispatch = useStoreDispatch();
    const [hasBeenAuthed, setHasBeenAuthed] = useState(!!user);

    useEffect(() => {
        if (user && !hasBeenAuthed) 
            setHasBeenAuthed(true);
        else if (!user && hasBeenAuthed) {
            router.replace('/auth/login');
        }
    }, [user, hasBeenAuthed, router, setHasBeenAuthed]);

    return null;
}

export default useRedirectOnLogout;