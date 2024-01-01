import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RecipePreview } from '@/helpers/types';

const sizes = "(max-width: 380px) 50vw, (max-width: 1024px) 40vw, 20vw";
const classes = {
    base: 'grid gap-2 p-2 border border-gray-300 rounded-md hover:text-green transition-colors duration-200',
    height: 'h-recipe-item-sm md:max-lg:h-recipe-item-md',
    cols: 'grid-cols-2 min-[380px]:grid-cols-2-1 md:max-lg:grid-cols-1',
    rows: 'grid-rows-1 md:max-lg:grid-rows-1-3',
    active: 'text-green border-green bg-green-shadow',
    currentClass(isActive: boolean) {
        return `${this.base} ${this.height} ${this.cols} ${this.rows} ${isActive ? this.active : ''}`;
    },
};

function RecipeItem({recipe, isActive} : {recipe: RecipePreview, isActive: boolean}) {

    return <Link href={`/recipes/${recipe.id!}`}>
        <div className={classes.currentClass(isActive)}>
            <div className="p-4 flex flex-col justify-center">
                <h4 className="text-2xl font-medium mb-2">{ recipe.title }</h4>
                <div className="text-xs">{ recipe.description }</div>
            </div>
            {recipe.imagePath && <div className='relative'>
                <Image className='object-cover' src={recipe.imagePath} fill alt={`${recipe.title} photo`} sizes={sizes}/>
            </div>}
        </div>
    </Link>
}

export default memo(RecipeItem);