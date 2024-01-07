'use client'

import { useStoreSelector } from "@/store/store"
import Spinner from "../ui/Spinner";

export default function RecipeListSpinner() {
    const initialised = useStoreSelector(state => state.recipes.initialised);

    return initialised ? <></> : <Spinner />
}