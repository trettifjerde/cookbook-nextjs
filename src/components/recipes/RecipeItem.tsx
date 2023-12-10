import { RecipePreview } from '@/helpers/types';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

const sizes = "(max-width: 380px) 50vw, (max-width: 768px) 33vw, 20vw";
const classes = {
    base: 'min-h-recipe-item p-2 border border-gray-300 rounded-md hover:text-green transition-colors duration-200',
    active: 'text-green border-green bg-green-light',
    currentClass(isActive: boolean) {
        return isActive ? `${this.base} ${this.active}` : this.base;
    },
};

function RecipeItem({recipe, isActive} : {recipe: RecipePreview, isActive: boolean}) {
    return (
        <Link href={`/recipes/${recipe.id!}`}>
            <div className={classes.currentClass(isActive)}>
                <div className="p-4">
                    <h4 className="text-2xl font-medium mb-2">{ recipe.title }</h4>
                    <div className="text-xs">{ recipe.description }</div>
                </div>
                {recipe.imagePath && <div className='relative'>
                    <Image src={recipe.imagePath} fill alt={`${recipe.title} photo`} sizes={sizes}/>
                </div>}
            </div>
        </Link>
    )
}

export default memo(RecipeItem);