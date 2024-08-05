import { INIT_RECIPE_PREVS_TAG } from "./config";
import { FetchError, FetchResponse, FetchSuccess, Ingredient, InitPreviewsBatch, Recipe, RecipePreview } from "./types";

export async function fetchData<T>(
    url: string,
    name: string,
    config?: {
        body?: BodyInit,
        headers?: Headers,
        cache?: 'force-cache' | 'no-store',
        next?: NextFetchRequestConfig,
        signal?: AbortSignal
    },
): Promise<FetchResponse<T>> {

    return fetch(new URL(url, process.env.NEXT_PUBLIC_HOST), config)
        .then(res => {
            if (!res.ok) {
                switch (res.status) {
                    case 400:
                        throw new Error(`Bad request fetching ${name}`)
                    case 401:
                        throw new Error('Authentication error');
                    case 404:
                        throw new Error(`${name.slice(0, 1).toUpperCase() + name.slice(1)} not found`);
                    case 500:
                        throw new Error(`Database error while fetching ${name}`);
                    default:
                        throw new Error(`Error fetching ${name}`);
                }
            }

            if (res.headers.get('Content-Type') === 'application/json')
                return res.json()

            return res.text()
        })
        .then((data: T) => ({
            ok: true,
            data
        } as FetchSuccess<T>))
        .catch((err: Error) => ({
            ok: false,
            message: err.message || 'An error has occurred'
        } as FetchError))
}

export async function fetchInitPreviews() {
    console.log('fetching init previews');

    return fetchData<InitPreviewsBatch>('/api/recipes', 'recipes', {
        cache: 'force-cache',
        next: {
            tags: [INIT_RECIPE_PREVS_TAG]
        }
    })
    .then(res => {
        if (!res.ok)
            console.log(res.message)
        return res;
    })
}

export async function fetchRecipe(id: string, caller: string) {
    console.log('fetching recipe', id, 'for', caller);
    return fetchData<Recipe>(`/api/recipes/${id}`, 'recipe', {
        cache: 'force-cache',
        next: { 
            tags: [id] 
        } 
    });
}

export async function fetchMorePreviews(lastId: string) {
    // console.log('fetching more previews starting from', lastId);
    const query = new URLSearchParams({lastId});
    return fetchData<RecipePreview[]>(`/api/more?${query.toString()}`, 'more recipes');
}

export async function fetchList(signal: AbortSignal) {
    // console.log('fetching list');
    return fetchData<Ingredient[]>('/api/list', 'shopping list', {
        cache: 'no-store',
        signal 
    });
}