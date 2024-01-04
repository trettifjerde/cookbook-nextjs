import { useEffect, useState } from "react";

export default function useSpinner() {
    const [pending, setPending] = useState(false);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        if (pending) {
            const timer = setTimeout(() => setSpinner(true), 50);
            return () => clearTimeout(timer);
        }
        else {
            setSpinner(false);
        }
    }, [pending]);

    return {spinner, setPending};
}