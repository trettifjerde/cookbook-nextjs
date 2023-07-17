'use client';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import RecipeItem from "./RecipeItem";
import { RecipePreview } from '@/helpers/types';
import { usePathname } from 'next/navigation';


const RecipeList = ({filterString, recipes}: {recipes: RecipePreview[], filterString: string}) => {
    const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(filterString));
    const pathname = usePathname();

    return (<div className="recipes-c fadeIn">
            <TransitionGroup className="recipes-c">
                {filteredRecipes.map(r => <CSSTransition key={r.id} classNames="recipe-item" timeout={400}>
                    <RecipeItem recipe={r} isActive={pathname.endsWith(r.id)}/>
                </CSSTransition>) }
                {filteredRecipes.length === 0 && <CSSTransition key="recipes-btn" classNames="recipe-item" timeout={400}>
                    <div className="empty">No recipes found</div>
                </CSSTransition>}
            </TransitionGroup>                
        </div>
    )
}
export default RecipeList;