import Link from "next/link";
import { MouseEventHandler, ReactNode, forwardRef } from "react";
import MiniSpinner from "../MiniSpinner/MiniSpinner";

type BtnColor = 'green' | 'red' | 'greenOutline' | 'redOutline' | 'whiteOutline';

type BtnProps = {
    children: ReactNode, 
    color: BtnColor,
    onClick?: MouseEventHandler,
    className?: string, 
    isSquare?: boolean,
    type?: 'submit'|'button',
    disabled?: boolean
}

type SpinnerBtnProps = BtnProps & {pending: boolean};


const base = 'py-2 border border-solid rounded-md transition disabled:opacity-60';
const shape = (isSquare: boolean) => isSquare ? 'min-w-btn-square px-2 aspect-square' : 'px-3';

const colors = {
    green: 'text-white bg-green hover:bg-green-hover active:bg-green-active disabled:bg-green-shadow disabled:hover:bg-green-shadow',
    red: 'text-white bg-red hover:bg-red-hover active:bg-red-active disabled:hover:bg-red',
    greenOutline: 'text-green border-green hover:bg-green hover:text-white',
    redOutline: 'text-red border-red',
    whiteOutline: 'text-white border-white hover:bg-white-shadow hover:bg-white hover:text-white'
}

export function Button({
    onClick=() => {}, children, color, type='submit', className='', isSquare=false, disabled=false
}: BtnProps) {
    return <button type={type} onClick={onClick} disabled={disabled}
        className={`${base} ${colors[color]} ${className} ${shape(isSquare)}`}>
            {children}
    </button>
}

export function LinkButton({url, color, children}: {url: string, color: BtnColor, children: ReactNode}) {
    return <Link href={url} className={`${base} ${colors[color]} ${shape(false)}`}>{children}</Link>
}

export const SpinnerButton = forwardRef<HTMLDivElement, SpinnerBtnProps>(({
    onClick=() => {}, children, color, type='submit', className='', isSquare=false, disabled=false, pending}, ref) => {

    return <div ref={ref} className={`relative ${className}`}>
        <Button type={type} className="w-full" isSquare={isSquare} disabled={disabled} onClick={onClick} color={color}>{children}</Button>
        {pending && <MiniSpinner white={color === 'whiteOutline'} absolute />}
    </div>
})