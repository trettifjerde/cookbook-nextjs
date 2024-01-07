import Image from 'next/image';
import Link from 'next/link';
import { RecipePreview } from '@/helpers/types';

const sizes = "(max-width: 380px) 50vw, (max-width: 1024px) 40vw, 20vw";
const container = {
    base: 'gap-2 p-2 border border-gray-300 rounded-md hover:text-green transition-colors duration-200',
    withImage: 'grid grid-cols-2 min-[380px]:grid-cols-2-1 md:max-lg:grid-cols-1 grid-rows-1 md:max-lg:grid-rows-2',
    withoutImage: 'flex items-center',
    height: 'min-h-recipe-item-sm md:max-lg:min-h-recipe-item-md',
    active: 'text-green border-green bg-green-shadow',
    currentClass(isActive: boolean, hasImage: string) {
        return `${this.base} ${this.height} ${hasImage ? this.withImage : this.withoutImage} ${isActive ? this.active : ''}`;
    },
};

const description = {
    base: 'text-xs ',
    withImage: 'line-clamp-4',
    withoutImage: 'line-clamp-6 md:max-lg:line-clamp-12',
    currentClass(hasImage: string) {
        return `${this.base} ${hasImage ? this.withImage : this.withoutImage}`
    }
}

function RecipeItem({recipe, isActive} : {recipe: RecipePreview, isActive: boolean}) {

    return <Link href={`/recipes/${recipe.id!}`}>
        <div className={container.currentClass(isActive, recipe.imagePath)}>
            <div className="p-4 flex flex-col justify-center">
                <h4 className="text-2xl font-medium mb-2 line-clamp-3">{ recipe.title }</h4>
                <div className={description.currentClass(recipe.imagePath)}>{ recipe.description }</div>
            </div>
            {recipe.imagePath && <div className='relative'>
                <Image className='object-cover' src={recipe.imagePath} fill alt={`${recipe.title} photo`} sizes={sizes}/>
            </div>}
        </div>
    </Link>
}

export default RecipeItem;