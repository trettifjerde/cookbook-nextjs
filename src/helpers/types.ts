export type FirebaseToken = {
    email: string, 
    localId: string, 
    idToken: string, 
    expiresIn: number
}

export type CookieUser = {
    id: string,
    token: string
}

export interface User {
    email: string, 
    id: string, 
    token: string, 
    expirationDate: string
}

export interface TimedUser extends User {
    timer: any
}

export type AuthForm = {
    email: string,
    password: string
}

export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export type Recipe = {
    name: string,
    id: string | null,
    description: string,
    imagePath: string,
    steps: string[],
    ingredients: FirebaseIngredient[]
}

export type RecipePreview = {
    name: string,
    id: string,
    description: string,
    imagePath: string
}

export type FormRecipe = {
    name: string,
    id: string | null,
    description: string,
    imagePath: string,
    steps: string[],
    ingredients: FirebaseIngredient[]
}

export type FirebaseRecipe = {
    name: string,
    description: string,
    imagePath: string,
    steps: string[],
    ingredients: FirebaseIngredient[]
}

export type FirebaseIngredient = {
    name: string,
    amount?: number,
    unit?: string
}

export type Ingredient = {
    id: string,
    name: string,
    amount: number,
    unit: string
}

export type FormIngredient = {
    id: string,
    name: string,
    amount: string,
    unit: string
}

export type FormErrors = {
    [key: string]: string
}

export type AuthMode = 'login' | 'signup';