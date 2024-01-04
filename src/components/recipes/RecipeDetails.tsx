import { Suspense } from 'react';
import Image from 'next/image';
import { Recipe } from '@/helpers/types';
import RecipeManageButton from './RecipeManageButton';

const sizes = "(max-width: 576px) 100vw, 60vw";

export default function RecipeDetails({recipe}: {recipe: Recipe}) {

    return (<>
        <div className="relative h-[60vh] mb-6">
            <div className="w-full h-full bg-dark-green-shadow flex justify-center items-center">
                {recipe.imagePath && <Image className='max-w-full object-cover' alt={recipe.title} src={recipe.imagePath} fill sizes={sizes}/>}
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-8 py-6 text-white bg-dark-green-shadow min-h-details-info rounded-t-lg">
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

        <div className="animate-fadeUp mb-6">
            <h5 className='text-xl font-medium mb-6'>Ingredients</h5>
            <ul className="border border-gray-200 rounded-md divide-y">
                { 
                    recipe.ingredients.map((ing, i) => 

                        <li key={i} className="p-3">
                            <div className='flex flex-row justify-between items-center gap-2'>
                                <span>{ing.name}</span>
                                <span>{ing.amount} {ing.unit}</span>
                            </div>
                        </li>)
                }
            </ul>
        </div>

        <div className="animate-fadeUp mb-6">
            <h5 className='text-xl font-medium mb-6'>Steps</h5>
            <ol className="border border-transparent divide-y list-decimal list-inside marker:text-green marker:font-medium">
                { recipe.steps.map((step, i) => <li key={i} className="p-3">{step}</li>) }
            </ol>
        </div>
    </>)
};