import { RECIPE_PREVIEW_LENGTH } from "./config";
import { FormRecipe, RecipePreview } from "./types";

export function statusCodeToMessage(code: number) {
    switch (code) {
        case 400:
            return 'Some of your data is invalid.';
        
        case 401:
            return 'Authentication error. Try signing out and in again.';

        case 404: 
            return 'Not found';

        case 500:
            return 'Database error';

        case 503:
            return 'Image hosting service is unavailable. You can publish your recipe without the image now and add it later.'

        default:
            return '';
    }
}

export function fromFormToRecipePreview(r: FormRecipe, id: string) {
    const preview: RecipePreview = {
        id,
        title: r.title,
        description: r.description.slice(0, RECIPE_PREVIEW_LENGTH),
        imagePath: r.imagePath || ''
    };
    return preview;
}

export async function readImage(file: Blob|File) {
    return new Promise((resolve : (value: string) => void, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.onabort = () => reject(new Error('Reader aborted loading'));
        reader.readAsDataURL(file);
    })
    .catch(error => {
        console.log(error);
        return null;
    })
}