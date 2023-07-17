'use client';
import { RecipePreview } from "@/helpers/types";
import Link from "next/link";
import { ChangeEventHandler, ReactNode, useCallback, useEffect, useState } from "react";
import RecipeList from "./RecipeList";
import { useStoreDispatch, useStoreSelector } from "@/store/store";
import { generalActions } from "@/store/generalState";
import { recipesActions } from "@/store/recipesState";
import Spinner from "../Spinner";
import { fetchRecipes } from "@/helpers/dataClient";
import { usePathname, useRouter } from "next/navigation";

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
    const [spinnerVisible, setSpinnerVisible] = useState(false);

    const handleFilterChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        setFilterString(e.target.value.toLocaleLowerCase());
    }, []);
    const clearFilter = useCallback(() => setFilterString(''), []);

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

    return (<div className={`fadeIn ${isMobileVisible ? 'open' : ''}`}>
        <div className="row align-items-center search-bar">
            <div className="col-auto">
                <Link href="/recipes/new" className="btn btn-success">New Recipe</Link>
            </div>
            <div className="col input-cont">
                <input type="text" className="form-control" value={filterString} onChange={handleFilterChange} placeholder="Type for a recipe..." />
                <button type="button" className="btn btn-danger" onClick={clearFilter}>X</button>
            </div>
        </div>
        <div className="show-recipes-btn mb-2">
            <button type="button" className={`btn w-100 ${isMobileVisible ? 'btn-danger' : 'btn-success'}`} onClick={toggleMobileRecipes}>{ isMobileVisible ? 'Hide recipes' : 'Show recipes'}</button>
        </div>
        <div className="row mb-3">
            <aside className="col-md-5 side">
                <button type="button" className="btn btn-success" disabled={!hasMoreRecipes} onClick={loadMoreRecipes}>{getLoadBtnText(hasMoreRecipes)}</button>  
                <RecipeList recipes={isInitialized ? recipes : initRecipes} filterString={filterString}/>
                {spinnerVisible && <Spinner />}
            </aside>
            <article className="col-md-7 main">
                {children}
            </article>
        </div>
    </div>)
}