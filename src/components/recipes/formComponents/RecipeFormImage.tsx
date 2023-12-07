import { RECIPE_IMAGE_FILE, RECIPE_IMAGE_PATH } from "@/helpers/types";
import { ChangeEventHandler, useRef, useState } from "react";
import { RECIPE_IMAGE_FILE_FORMATS, RECIPE_IMAGE_FILE_MIME } from "@/helpers/config";
import { AnimatePresence, motion } from "framer-motion";
import imageStyles from './recipe-image.module.scss';
import formStyles from './form.module.scss';
import { readImage } from "@/helpers/client-helpers";

function getInitialPreview(src: string) {
    const name = 'Your current recipe preview';
    return src ? {name, src} : null;
}

export default function RecipeFormImage({defaultValue, hasError, touchField}: {
    defaultValue: string, 
    hasError: boolean, 
    touchField: (key: string, value: string) => void
}) {

    const [preview, setPreview] = useState(() => getInitialPreview(defaultValue));
    const [imagePath, setImagePath] = useState(defaultValue);
    const fileInput = useRef<HTMLInputElement>(null);

    const registerTouch = (v: string) => touchField('general', v);

    const setInitialPreview = () => {
        setPreview(getInitialPreview(defaultValue));
        setImagePath(defaultValue);
    };

    const handleFileChange : ChangeEventHandler<HTMLInputElement> = async (e) => {
        console.log('handling file change');
        const f = fileInput.current?.files?.[0];
        if (!f)
            return;

        if (!RECIPE_IMAGE_FILE_FORMATS.includes(f.type)) {
            alert('Invalid file format: must be a jpeg or png image');
            return;
        }

        const data = await readImage(f);
        if (data)
            setPreview({name: f.name, src: data})
    }
    const handleSelect = () => {
        if (fileInput.current)
            fileInput.current.click();
    }

    const handleDelete = () => {
        if (fileInput.current) {
            fileInput.current.value = '';
        }
        setPreview(null);
        setImagePath('');
    }

    return <>
        <div className={formStyles.label}>
            <label htmlFor={RECIPE_IMAGE_FILE}>Image file</label>
            <p className={formStyles.error}>{hasError && 'Invalid recipe image'}</p>
        </div>
        <div>
            <input hidden type="file" ref={fileInput} accept={RECIPE_IMAGE_FILE_MIME} name={RECIPE_IMAGE_FILE} onChange={handleFileChange} />
            <input hidden type="text" name={RECIPE_IMAGE_PATH} value={imagePath} onChange={() => {}}/>
            <div className="note">Select from your device</div>
            
            <AnimatePresence mode="wait" initial={false}>
                {preview && <motion.div key="img" className={imageStyles['recipe-image-cont']} 
                    variants={variants} initial="hidden" exit="hidden" animate="visible">
                    <img src={preview.src} />
                    <div className={`col-cen ${imageStyles.overlay}`}>
                        <p>{preview.name}</p>
                        <button className="btn btn-primary" type="button" onClick={handleDelete}>Remove</button>
                    </div>
                </motion.div>}
                {!preview && <motion.div key="btn" 
                    variants={variants} initial="hidden" exit="hidden" animate="visible">
                    <button className="btn btn-primary" type="button" onClick={handleSelect}>Select</button>
                    {defaultValue && <button type='button' className="btn btn-outline-success" onClick={setInitialPreview}>
                        Set back the current one
                        </button>}
                </motion.div>
                }
            </AnimatePresence>
        </div>
    </>
}

const variants = {
    visible: {
        opacity: 1, 
        transform: 'scale(1)'
    },
    hidden: {
        opacity: 0, 
        transform: 'scale(0.95)'
    }
}