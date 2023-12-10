import { Recipe } from '@/helpers/types';
import Image from 'next/image';
import RecipeManageButton from './RecipeManageButton';

const sizes = "(max-width: 576px) 100vw, 60vw";

export default function RecipeDetails({recipe}: {recipe: Recipe}) {

    return (<>
        <div className="relative h-[60vh] mb-6">
            <div className="w-full h-full bg-dark-green-shadow flex justify-center items-center">
                {recipe.imagePath && <Image className='max-w-full' alt={recipe.title} src={recipe.imagePath} fill sizes={sizes}/>}
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-8 py-6 text-white bg-dark-green-shadow min-h-recipe-item rounded-t-lg">
                <div className='fadeUp'>  
                    <div className="flex flex-row flex-wrap gap-4 justify-between items-center mb-4">
                        <h1 className="text-4xl font-medium">{ recipe.title }</h1>
                        <RecipeManageButton recipe={recipe} /> 
                    </div>
                    <div>{recipe.description}</div>
                </div>
            </div>
        </div>

        <div className="fadeIn mb-6">
            <h5 className='text-xl font-medium mb-6'>Ingredients</h5>
            <ul className="border border-gray-200 rounded-md divide-y">
                { 
                    recipe.ingredients.map((ing, i) => 

                        <li key={i} className="px-3 py-2">
                            <div className='row justify-content-between'>
                                <span className='col-auto'>{ing.name}</span>
                                <span className='col-auto'>{ing.amount} {ing.unit}</span>
                            </div>
                        </li>)
                }
            </ul>
        </div>

        <div className="fadeIn mb-6">
            <h5 className='text-xl font-medium mb-6'>Steps</h5>
            <ol className="border border-transparent divide-y list-decimal list-inside">
                { recipe.steps.map((step, i) => <li key={i} className="px-3 py-2">{step}</li>) }
            </ol>
        </div>
    </>)
};