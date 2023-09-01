'use client';
import { useStoreSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirectOnLogout = () => {
    const router = useRouter();
    const user = useStoreSelector(state => state.general.user);

    useEffect(() => {
        if (!user) {
            router.replace('/auth/login');
        }
    }, [user, router]);

    return null;
}

export default useRedirectOnLogout;