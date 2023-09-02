'use client';
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RecipePreview } from "@/helpers/types";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { generalActions } from "@/store/generalState";
import { recipesActions } from "@/store/recipesState";
import { fetchRecipes } from "@/helpers/dataClient";
import RecipeList from "./RecipeList";
import Spinner from "../Spinner";
import { AnimatePresence } from "framer-motion";

function getLoadBtnText(hasMore: boolean) {
    return hasMore ? 'Load more recipes' : 'No more recipes to load';
}

export default function Recipes({recipes: initRecipes, children}: {recipes: RecipePreview[], children: ReactNode}) {
    const pathname = usePathname();
    const {recipes, isInitialized} = useStoreSelector(state => state.recipes);
    const dispatch = useStoreDispatch();

    const [hasMoreRecipes, setHasMoreRecipes] = useState(true);
    const [isMobileVisible, setMobileVisible] = useState(true);
    const [filterString, setFilterString] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [spinnerVisible, setSpinnerVisible] = useState(true);
    const filterRef = useRef<HTMLInputElement>(null);
    const [isTypingTimer, setIsTypingTimer] = useState<any>(null);

    const handleFilterChange = () => {
        if (isTypingTimer) {
            clearTimeout(isTypingTimer);
            setIsTypingTimer(null);
        }
        setIsTypingTimer(setTimeout(() => setFilterString(filterRef.current?.value || ''), 200));
    }

    const clearFilter = useCallback(() => {
        setFilterString('');
        if (filterRef.current)
            filterRef.current.value = '';
    }, [filterRef, setFilterString]);

    const toggleMobileRecipes = useCallback(() => setMobileVisible(prev => (!prev)), [setMobileVisible]);

    const loadMoreRecipes = useCallback(async () => {
        setIsFetching(true);

        const res = await fetchRecipes(recipes[recipes.length - 1].id);
        if ("error" in res) 
            dispatch(generalActions.flashToast({text: res.error, isError: true}));
        else if (res.length > 0)
            dispatch(recipesActions.loadMoreRecipes(res))
        else 
            setHasMoreRecipes(false);

        setIsFetching(false);

    }, [recipes, dispatch, setIsFetching, setHasMoreRecipes]);

    useEffect(() => {
        if (pathname === '/recipes') setMobileVisible(true)
        else setMobileVisible(false);
    }, [pathname, setMobileVisible]);

    useEffect(() => {
        if (!isInitialized) {
            dispatch(recipesActions.initRecipes(initRecipes));
        }
    }, [initRecipes, isInitialized, dispatch, setIsFetching]);

    useEffect(() => {
        if (isFetching) {
            const timer = setTimeout(() => setSpinnerVisible(true), 200);
            return () => clearTimeout(timer);
        }
        else 
            setSpinnerVisible(false);
    }, [isFetching]);

    useEffect(() => {
        if (!hasMoreRecipes) {
            const timer = setTimeout(() => setHasMoreRecipes(true), 30 * 1000);
            return () => clearTimeout(timer);
        }
    }, [hasMoreRecipes, setHasMoreRecipes]);

    return (<>
            <div className="row align-items-center search-bar">
                <div className="col-auto">
                    <Link href="/recipes/new" className="btn btn-success">New Recipe</Link>
                </div>
                <div className="col input-cont">
                    <input type="text" className="form-control" ref={filterRef} onChange={handleFilterChange} placeholder="Type for a recipe..." />
                    <button type="button" className="btn btn-danger" onClick={clearFilter}>X</button>
                </div>
            </div>
            <div className="show-recipes-btn mb-2">
                <button type="button" className={`btn w-100 ${isMobileVisible ? 'btn-danger' : 'btn-success'}`} onClick={toggleMobileRecipes}>{ isMobileVisible ? 'Hide recipes' : 'Show recipes'}</button>
            </div>
            <div className={`row mb-3 ${isMobileVisible ? 'open' : ''}`}>
                <aside className="col-md-5 side">
                    <button type="button" className="btn btn-success" disabled={!hasMoreRecipes} onClick={loadMoreRecipes}>{getLoadBtnText(hasMoreRecipes)}</button>  
                    <RecipeList recipes={isInitialized ? recipes : initRecipes} filterString={filterString}/>
                    {spinnerVisible && <Spinner />}
                </aside>
                <article className="col-md-7 main">
                    {children}
                </article>
            </div>
    </>)
}