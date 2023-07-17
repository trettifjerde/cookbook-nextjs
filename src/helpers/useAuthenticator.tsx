import { useStoreSelector } from "@/store/store";
import { useEffect, useState } from "react";

export default function useAuthenticator() {
    const user = useStoreSelector(state => state.general.user);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => setAuthenticated(!!user), [user]);

    return {user, authenticated};
}