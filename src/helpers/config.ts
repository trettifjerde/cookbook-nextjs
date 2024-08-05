import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const COOKBOOK_DB= process.env.COOKBOOK_DB || '';
export const USERS_COLLECTION= process.env.USERS_COLLECTION || '';
export const RECIPES_COLLECTION= process.env.RECIPES_COLLECTION || '';
export const LIST_COLLECTION= process.env.LIST_COLLECTION || '';

export const RECIPE_PREVIEW_BATCH_SIZE = 4;
export const RECIPE_PREVIEW_LENGTH = 500;

export const INIT_RECIPE_PREVS_TAG = 'init-recipe-prevs';

export const RECIPE_IMAGE_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
export const RECIPE_IMAGE_FILE_MIME = RECIPE_IMAGE_FILE_FORMATS.join(', ');

export const ALERT_TIMEOUT = 3000;

const COOKIE_CONFIGS : {[key in NodeJS.ProcessEnv['NODE_ENV']]: Partial<ResponseCookie>} = {
    production: {
        maxAge: 60 * 60,
        httpOnly: true,
        // secure: true, 
        sameSite: 'strict'
    },
    development: {
        maxAge: 60 * 60,
        httpOnly: true,
        sameSite: 'strict'
    },
    test: {
        maxAge: 60 * 60,
        httpOnly: true,
        sameSite: 'strict'
    }
};

export const COOKIE_CONFIG = COOKIE_CONFIGS[process.env.NODE_ENV || 'development'];