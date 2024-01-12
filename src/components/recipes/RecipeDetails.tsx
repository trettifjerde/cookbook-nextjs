import { Suspense } from 'react';

import { Recipe } from '@/helpers/types';

import RecipeManageButton from './details/RecipeManageButton';
import { detailsClasses as classes } from './details/classes';
import RecipeDetailsImage from './details/RecipeDetailsImage';
import BtnFallback from './details/manage-btn/BtnFallback';

export default function RecipeDetails({recipe}: {recipe: Recipe}) {

    return (<>
        <div className={classes.container}>
            
            <RecipeDetailsImage title={recipe.title} imagePath={recipe.imagePath} />

            <div className={classes.header}>
                <div className='animate-fadeUp'>  
                    <div className="flex flex-row justify-between items-center gap-2 mb-4">
                        <h1 className="text-4xl font-medium">{ recipe.title }</h1>
                        <Suspense fallback={<BtnFallback />}>
                            <RecipeManageButton recipe={recipe} /> 
                        </Suspense>
                    </div>
                    <div>{recipe.description}</div>
                </div>
            </div>
        </div>

        <div className={classes.detailsBlock(true)}>
            <h5 className={classes.blockHeading}>Ingredients</h5>
            <ul className={classes.ul}>
                { 
                    recipe.ingredients.map((ing, i) => 

                        <li key={i} className={classes.li}>
                            <div className='flex flex-row justify-between items-center gap-2'>
                                <span>{ing.name}</span>
                                <span>{ing.amount} {ing.unit}</span>
                            </div>
                        </li>)
                }
            </ul>
        </div>

        <div className={classes.detailsBlock(true)}>
            <h5 className={classes.blockHeading}>Steps</h5>
            <ol className={classes.ol}>
                { recipe.steps.map((step, i) => <li key={i} className={classes.li}>{step}</li>) }
            </ol>
        </div>
    </>)
};