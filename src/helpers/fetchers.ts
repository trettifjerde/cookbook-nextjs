import { INIT_RECIPES_TAG } from "./config";
import { FetchResponse, FetchSuccess, Ingredient, InitPreviewsBatch, Recipe, RecipePreview } from "./types";

export async function fetchData<T>(
    url: string, 
    name: string, 
    config?: {
        method?: 'GET' | 'POST' | 'DELETE',
        body?: BodyInit,
        headers?: Headers,
        next?: NextFetchRequestConfig,
        signal?: AbortSignal
    },
) : Promise<FetchResponse<T>> {

    return fetch(new URL(url, process.env.NEXT_PUBLIC_HOST), config)
        .then(res => {

            if (!res.ok) {
                let action = 'fetching';

                switch(config?.method) {
                    case 'DELETE':
                        action = 'deleting';
                        break;
                    case 'POST':
                        action = 'copying';
                        break;
                }

                switch(res.status) {
                    case 400:
                        throw new Error(`Bad request ${action} ${name}`)
                    case 401:
                        throw new Error('Authentication error');
                    case 404:
                        throw new Error(`${name.slice(0, 1).toUpperCase() + name.slice(1)} not found`);
                    case 500: 
                        throw new Error(`Database error while ${action} ${name}`);
                    default: 
                        throw new Error(`Error ${action} ${name}`);
                }
            }

            if (res.headers.get('Content-Type') === 'application/json')
                return res.json()
            
            return res.text()
        })
        .then((data: T) => ({
            type: 'success',
            data
        } as FetchSuccess<T>))

        .catch((err: Error) => ({
            type: 'error',
            message: err.message || 'An error has occurred'
        }))
}

export async function fetchInitPreviews() {
    //console.log('fetching init previews');

    return fetchData<InitPreviewsBatch>('/api/recipes', 'recipes', {next: {tags: [INIT_RECIPES_TAG]}})
        .then(res => {
            switch(res.type) {
                case 'error':
                    console.log(res.message);
                    return {previews: [], id: 0}
                    
                case 'success':
                    return res.data;
            }
        })
}

export async function fetchRecipe(id: string, caller: string) {
    //console.log('fetching recipe', id, 'for', caller);
    return fetchData<Recipe>(`/api/recipes/${id}`, 'recipe', {next: {tags: [id]}});
}

export async function fetchMorePreviews(lastId: string) {
    //console.log('fetching more previews starting from', lastId);
    return fetchData<RecipePreview[]>(`/api/more`, 'more recipes', {
        method: 'POST', 
        body: JSON.stringify({lastId}),
        headers: new Headers({'Content-Type': 'application/json'}),
    });
}

export async function fetchList(signal: AbortSignal) {
    //console.log('fetching list');
    return fetchData<Ingredient[]>('/api/list', 'shopping list', {method: 'GET', signal});
}