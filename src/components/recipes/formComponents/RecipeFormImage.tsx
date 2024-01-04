import { ChangeEventHandler, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RECIPE_IMAGE_FILE, RECIPE_IMAGE_PATH } from "@/helpers/types";
import { RECIPE_IMAGE_FILE_FORMATS, RECIPE_IMAGE_FILE_MIME } from "@/helpers/config";
import { readImage } from "@/helpers/client-helpers";
import { Note } from "@/components/ui/elements/misc";
import { Button } from "@/components/ui/elements/buttons";
import RecipeFormGroup from "./RecipeFormGroup";

function getInitialPreview(src: string) {
    const name = 'Your current recipe preview';
    return src ? {name, src} : null;
}

export default function RecipeFormImage({defaultValue, hasError}: {
    defaultValue: string, 
    hasError: boolean
}) {

    const [preview, setPreview] = useState(() => getInitialPreview(defaultValue));
    const [imagePath, setImagePath] = useState(defaultValue);
    const fileInput = useRef<HTMLInputElement>(null);

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

    return <RecipeFormGroup label="Image file" htmlFor={RECIPE_IMAGE_FILE} hasError={hasError} errorMsg="Invalid recipe image">
        <div>
            <input hidden type="file" ref={fileInput} accept={RECIPE_IMAGE_FILE_MIME} name={RECIPE_IMAGE_FILE} onChange={handleFileChange} />
            <input hidden type="text" name={RECIPE_IMAGE_PATH} value={imagePath} onChange={() => {}}/>

            <Note className="mb-4" text="Select from your device" />
            
            <AnimatePresence mode="wait" initial={false}>

                {preview && <motion.div key="img" 
                    className="relative flex flex-col justify-center items-center gap-2 group" 
                    variants={variants} initial="hidden" exit="hidden" animate="visible">
                    <img className="max-w-full" src={preview.src} />
                    <div 
                        className="absolute flex flex-col items-center justify-center gap-3 opacity-0 inset-0 p-4 bg-white-overlay transition-opacity duration-300 group-hover:opacity-100">
                        <p>{preview.name}</p>
                        <Button color="green" type="button" onClick={handleDelete}>Remove</Button>
                    </div>
                </motion.div>}

                {!preview && <motion.div key="btn" 
                    variants={variants} initial="hidden" exit="hidden" animate="visible">
                    <Button className="mr-1" color="green" type="button" onClick={handleSelect}>Select</Button>
                    {defaultValue && <Button type='button' color="greenOutline" onClick={setInitialPreview}>
                        Set back the current one
                        </Button>}
                </motion.div>}

            </AnimatePresence>
        </div>
    </RecipeFormGroup>
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