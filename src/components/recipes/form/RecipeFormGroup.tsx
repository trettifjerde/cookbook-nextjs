import { ErrorMessage, HR } from "@/components/ui/elements/misc";
import { ReactNode } from "react";

type Props = {
    label: string,
    htmlFor?: string,
    hasError: boolean,
    errorMsg: string,
    children: ReactNode,
}

export const recipeLabelClass = "font-bold text-md";

export default function RecipeFormGroup({label, htmlFor, errorMsg, hasError, children}: Props) {

    return <>
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center gap-2">
                <label className={recipeLabelClass} htmlFor={htmlFor}>{label}</label>
                <ErrorMessage text={hasError && errorMsg}/>
            </div>
            {children}
        </div>
        <HR />
    </>
}