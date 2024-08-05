import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { ObjectId, WithId } from 'mongodb';
import { MongoRecipe, PreUploadFormRecipe } from '../types';

export function makeToken(id: string) {
    return jwt.sign({id}, process.env.JWT_PRIVATE!);
}

export function makeHash(password: string) {
    const hash = createHash('sha256')
        .update(password)
        .update(createHash('sha256').update(process.env.SALT!).digest('hex'))
        .digest('hex');

    return hash;
}

export async function uploadImageAndUpdateRecipe({recipe, authorId, id} : {recipe: PreUploadFormRecipe, authorId: string, id?: string}) {
    const {imagePath, imageFile, ...rest} = recipe;

    const mongoRecipe : WithId<MongoRecipe> = {
        ...rest, 
        _id: new ObjectId(id),
        authorId: new ObjectId(authorId),
        imagePath: imagePath || undefined
    };

    if (imageFile) {

        const imgBBData = new FormData();
        imgBBData.append('key', process.env.IMG_BB_KEY!);
        imgBBData.append('image', imageFile);

        const imgUrl = await fetch(process.env.IMG_BB_UPLOAD_URL!, {
            method: 'POST',
            body: imgBBData
        })
        .then(res => res.json())
        .then(res => {
            if (res.error)
                throw new Error(res.error.message);
            return res.data.display_url;
        })
        .catch(error => {
            console.log('Error uploading image file to imgbb', error);
            return null;
        });

        if (!imgUrl)
            return {mongoRecipe, uploadError: true};

        mongoRecipe.imagePath = imgUrl;
    }

    return {mongoRecipe, uploadError: false};
}