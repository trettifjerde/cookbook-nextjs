import RecipesFilter from "./RecipesFilter";
import { LinkButton } from "../ui/elements/buttons";

export default function RecipesSearchBar() {
    return <div className="flex flex-row items-center gap-3">
        <LinkButton color="green" url="/recipes/new">New recipe</LinkButton>
        <RecipesFilter/>
    </div>
}