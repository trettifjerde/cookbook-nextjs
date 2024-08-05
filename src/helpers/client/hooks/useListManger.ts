import { useCallback, useState } from "react";

export default function useListManager<T, N extends {id: string}>(init: T[], newItemGen: (i: number, item?: T) => N) {
    const [list, setList] = useState(init.length > 0 ? init.map((item: T, i: number) => newItemGen(i, item)) : [newItemGen(0)]);
    const [nextI, setNextI] = useState(list.length);

    const addItem = useCallback(() => {
        setList(prev => ([...prev, newItemGen(nextI)]));
        setNextI(prev => prev + 1)
    }, [setList, setNextI, newItemGen, nextI]);

    const removeItem = useCallback((id: string) => setList(prev => prev.filter(item => item.id !== id)), [setList]);

    const moveItem = useCallback((id: string, adjust: number) => setList((prev) => {
        const i = prev.findIndex(item => item.id === id);
        let filteredItems = [...prev];
        const splicedSteps = filteredItems.splice(i, 1);
        filteredItems.splice(i + adjust, 0, splicedSteps[0]);
        return filteredItems;
    }), [setList]);

    return {list, setList, addItem, removeItem, moveItem};
}