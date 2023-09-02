'use client';
import RecipePageWrapper from "@/components/recipes/RecipePageWrapper"

export default function Empty() {
    return <RecipePageWrapper className="empty">
        No recipe selected
    </RecipePageWrapper>
}