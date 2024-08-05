import { ObjectId, WithId } from "mongodb"

export const ING_NAME = 'name';
export const ING_AMOUNT = 'amount';
export const ING_UNIT = 'unit';
export const RECIPE_NAME = 'title';
export const RECIPE_DESC = 'description';
export const RECIPE_IMAGE_PATH = 'imagePath';
export const RECIPE_IMAGE_FILE = 'imageFile';
export const RECIPE_INGREDIENTS = 'ingredients';
export const RECIPE_STEPS = 'steps';
export const RECIPE_ING = 'ing';
export const RECIPE_STEP = 'step';

export type Method = 'GET' | 'POST' | 'DELETE' | 'PUT';

export type RecipePreview = {
    title: string,
    id: string,
    description: string,
    imagePath: string,
    lastUpdated: number
}

export type InitPreviewsBatch = {previews: RecipePreview[], id: number};

export type RecipePreviewClient = RecipePreview & {isClient: boolean};

export type FormRecipe = {
    title: string,
    description: string,
    imagePath: string,
    steps: string[],
    ingredients: RecipeIngredient[]
};

export type PreUploadFormRecipe = FormRecipe & {imageFile: File | null};

export type Recipe = FormRecipe & {id: string, authorId: string, lastUpdated: number };

export type MongoRecipe = {
    authorId: ObjectId,
    title: string,
    description: string,
    imagePath?: string,
    steps: string[],
    ingredients: RecipeIngredient[]
};

export type MongoRecipePreviewProjection = {
    title: string,
    _id: ObjectId,
    description: string,
    imagePath: string,
}

export type RecipeIngredient = {name: string, amount?: number, unit?: string};
export type Ingredient = RecipeIngredient & {id: string};
export type MongoIngredient = WithId<RecipeIngredient>;
export type MongoList = {list: MongoIngredient[]};

export type FormIngredient = {
    name: string,
    amount: string,
    unit: string,
    id: string
}

export type MongoUser = {
    email: string,
    hash: string
};

export type AuthFormData = {email: string, password: string};

export type FetchSuccess<T> = {ok: true, data: T};
export type FetchError = {ok: false, message: string};
export type FetchResponse<T> = FetchSuccess<T> | FetchError;

export type ErrorCodes = 400 | 401 | 404 | 500 | 503;
export type ServerActionError = {status: ErrorCodes};
export type ServerActionResponse = {status: 200} | ServerActionError;
export type ServerActionResponseWithData<T> = {status: 200, data: T} | ServerActionError;


export enum ListUpdaterCommand {Add, Update, Merge, RemoveDupe, Skip};
export type ListUpdaterInstruction<T> = {command: ListUpdaterCommand.Add, ing: T} |
    {command: ListUpdaterCommand.Update, ing: T} | 
    {command: ListUpdaterCommand.Merge, ing: T} |
    {command: ListUpdaterCommand.RemoveDupe} |
    {command: ListUpdaterCommand.Skip};

export type AlertType = 'error' | 'info' | 'success';
export type Alert = {type: AlertType, message: string} | null;