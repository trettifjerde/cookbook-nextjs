import { Recipe } from '@/helpers/types';
import Image from 'next/image';
import RecipeManageButton from './RecipeManageButton';

const sizes = "(max-width: 576px) 100vw, 60vw";

export default function RecipeDetails({recipe}: {recipe: Recipe}) {

    return (<>
        <div className="detail-header">
            <div className="detail-header-img">
                {recipe.imagePath && <Image alt={recipe.title} src={recipe.imagePath} fill sizes={sizes}/>}
            </div>
            <div className="detail-header-text">
                <div className='fadeUp'>
                    
                    <div className="row flex-wrap g-2 justify-content-between mb-3 align-items-center">
                        <h1 className="col-8">{ recipe.title }</h1>
                        <div className="col-auto">
                            <div className="dropdown">
                                <RecipeManageButton recipe={recipe} /> 
                            </div>
                        </div>
                    </div>
                    <div className="detail-desc">
                        <div>{recipe.description}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="detail-block fadeIn">
            <h5>Ingredients</h5>
            <ul className="list-group">
                {recipe.ingredients.map((ing, i) => 
                    <li key={i} className="list-group-item">
                        <div className='row justify-content-between'>
                            <span className='col-auto'>{ing.name}</span>
                            <span className='col-auto'>{ing.amount} {ing.unit}</span>
                        </div>
                    </li>)}
            </ul>
        </div>
        <div className="detail-block fadeUp">
            <h5>Steps</h5>
            <ol className="list-group list-group-flush list-group-numbered">
                { recipe.steps.map((step, i) => <li key={i} className="list-group-item">{step}</li>)}
            </ol>
        </div>
    </>)
};