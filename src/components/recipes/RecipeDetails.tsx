import { Suspense } from 'react';
import Image from 'next/image';

import { Recipe } from '@/helpers/types';

import RecipeManageButton from './details/RecipeManageButton';
import { detailsClasses as classes } from './details/classes';

const sizes = "(max-width: 576px) 100vw, 60vw";

export default function RecipeDetails({recipe}: {recipe: Recipe}) {

    return (<>
        <div className={classes.container}>
            <div className={classes.imageContainer.currentClass(recipe.imagePath)}>
                {recipe.imagePath && <Image className='object-cover 2xl:object-contain' alt={recipe.title} src={recipe.imagePath} fill sizes={sizes}/>}
            </div>
            <div className={classes.header}>
                <div className='animate-fadeUp'>  
                    <div className="lg:flex flex-row gap-8 justify-between mb-4">
                        <h1 className="text-4xl font-medium max-lg:mb-4">{ recipe.title }</h1>
                        <Suspense fallback={<></>}>
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