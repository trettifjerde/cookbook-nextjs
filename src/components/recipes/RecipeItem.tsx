import { RecipePreview } from '@/helpers/types';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

const sizes = "(max-width: 380px) 50vw, (max-width: 768px) 33vw, 20vw";

function RecipeItem({recipe, isActive} : {recipe: RecipePreview, isActive: boolean}) {
    return (
            <Link className={`card p-2 ${isActive? 'active' : ''}`} href={`/recipes/${recipe.id!}`}>
                <div className="card-wrapper">
                    <div className="card-body">
                        <h4 className="card-title">{ recipe.name }</h4>
                        <div className="card-text">{ recipe.description }</div>
                    </div>
                    <div className='ic c'>
                        <Image src={recipe.imagePath} fill alt={`${recipe.name} photo`} sizes={sizes}/>
                    </div>
                </div>
            </Link>
    )
}

export default memo(RecipeItem);