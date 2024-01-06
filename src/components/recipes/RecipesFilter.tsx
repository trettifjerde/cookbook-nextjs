'use client'

import { memo, useRef, useState } from "react";
import { recipesActions } from "@/store/recipes";
import { useStoreDispatch } from "@/store/store";
import { Input } from "../ui/elements/forms";
import { Button } from "../ui/elements/buttons";

function RecipesFilter() {

    const [isTypingTimer, setIsTypingTimer] = useState<any>(null);
    const filterRef = useRef<HTMLInputElement>(null);
    const dispatch = useStoreDispatch();

    const handleFilterChange = () => {
        if (isTypingTimer !== null)
            clearTimeout(isTypingTimer);
        
        setIsTypingTimer(setTimeout(() => {
            dispatch(recipesActions.setFilter(filterRef.current?.value || ''));
            setIsTypingTimer(null);
        }, 200));
    }

    const clearFilter = () => {
        dispatch(recipesActions.setFilter(''));
        if (filterRef.current)
            filterRef.current.value = '';
    };

    return <div className="group relative flex-grow p-1">
        <Input type="text" name="filter" id="filterStr" className="pr-input-square-offset [&:focus+button]:opacity-100" placeholder="Type for a recipe..." 
            ref={filterRef} onChange={handleFilterChange} />
        <Button type="button" color="red" isSquare 
            className="invisible opacity-0 absolute right-1 top-1 group-hover:visible group-hover:opacity-100 transition-hidden-btn duration-300" 
            onClick={clearFilter}>X</Button>
    </div>
};

export default memo(RecipesFilter);