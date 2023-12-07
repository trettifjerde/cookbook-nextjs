'use client'

import { recipesActions } from "@/store/recipes";
import { useStoreDispatch } from "@/store/store";
import { useRef, useState } from "react";

export default function RecipesFilter() {

    const [isTypingTimer, setIsTypingTimer] = useState<any>(null);
    const filterRef = useRef<HTMLInputElement>(null);
    const dispatch = useStoreDispatch();

    const handleFilterChange = () => {
        if (isTypingTimer) {
            clearTimeout(isTypingTimer);
        }
        setIsTypingTimer(setTimeout(() => dispatch(recipesActions.setFilter(filterRef.current?.value || '')), 200));
    }

    const clearFilter = () => {
        dispatch(recipesActions.setFilter(''));
        if (filterRef.current)
            filterRef.current.value = '';
    };

    return <div className="col input-cont">
        <input type="text" className="form-control" ref={filterRef} onChange={handleFilterChange} placeholder="Type for a recipe..." />
        <button type="button" className="btn btn-danger" onClick={clearFilter}>X</button>
    </div>
}