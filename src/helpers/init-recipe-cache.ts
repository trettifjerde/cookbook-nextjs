import { fetchData } from "./fetchers";
import { INIT_RECIPES_TAG } from "./config";
import { InitPreviewsBatch } from "./types";
import { unstable_cache } from "next/cache";

async function fetchInitRecipePreviews() {
    console.log('fetching init recipes');
    return fetchData<InitPreviewsBatch>('/api/recipes', 'recipes')
        .then(res => {
            switch(res.type) {
                case 'success':
                    return res.data;
                default:
                    return {previews: [], id: 0};
            }
        });
}

export const initRecipePreviews = unstable_cache(fetchInitRecipePreviews, ['init-recipes'], {tags: [INIT_RECIPES_TAG]});