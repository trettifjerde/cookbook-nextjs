'use client'

import Image from 'next/image';
import { detailsClasses as classes } from './classes';
import { useState } from 'react';

const sizes = "(max-width: 576px) 100vw, 60vw";

export default function RecipeDetailsImage({title, imagePath}: {title: string, imagePath: string}) {
    const [animate, setAnimate] = useState(false);

    return <div className={classes.imageContainer.currentClass(animate)}>
        {imagePath && <Image className='object-cover 2xl:object-contain animate-fadeIn' 
            alt={title} src={imagePath} fill sizes={sizes}
            onLoad={() => setAnimate(true)} />}
    </div>
}