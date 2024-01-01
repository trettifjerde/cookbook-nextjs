import Link from "next/link";
import { MouseEventHandler, ReactNode, forwardRef } from "react";
import MiniSpinner from "./misc";

export type BtnColor = 'green' | 'red' | 'greenOutline' | 'redOutline' | 'whiteOutline' | 'transparent';

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


const base = 'py-2 border border-solid rounded-md transition disabled:opacity-50 whitespace-nowrap';
const shape = (isSquare: boolean) => isSquare ? 'min-w-btn-square px-2 aspect-square' : 'px-3';

const colors = {
    green: 'text-white bg-green border-green hover:bg-green-hover active:bg-green-active disabled:hover:bg-green',
    red: 'text-white bg-red border-red hover:bg-red-hover active:bg-red-active disabled:hover:bg-red',
    greenOutline: 'bg-white text-green border-green hover:bg-green hover:text-white active:bg-green-hover',
    redOutline: 'text-red border-red hover:bg-red hover:text-white active:bg-red-hover',
    whiteOutline: 'text-white border-white hover:bg-white-shadow active:bg-white-overlay hover:text-white',
    transparent: 'text-green border-transparent'
}

const smallButtonClasses = {
    base: 'text-sm px-2 py-1 rounded-md border hover:text-white transition-colors duration-200',
    yellow: 'text-amber-500 border-amber-500 hover:bg-amber-500',
    red: 'text-red border-red hover:bg-red'
}

export const Button = forwardRef<HTMLButtonElement, BtnProps>((
    {onClick=() => {}, children, color, type='submit', className='', isSquare=false, disabled=false}, 
    ref) => {
    return <button ref={ref} type={type} onClick={onClick} disabled={disabled}
        className={`${base} ${colors[color]} ${className} ${shape(isSquare)}`}>
            {children}
    </button>
})

export const SmallButton = ({onClick, color, children}: {onClick: MouseEventHandler, color: 'red' | 'yellow', children: ReactNode}) => {
    return <button type="button" onClick={onClick} className={`${smallButtonClasses.base} ${smallButtonClasses[color]}`}>
        {children}
    </button>
}

export function LinkButton({url, color, children, className=''}: {url: string, color: BtnColor, children: ReactNode, className?: string}) {
    return <Link href={url} className={`${base} ${className} text-center ${colors[color]} ${shape(false)}`}>{children}</Link>
}

export const SpinnerButton = forwardRef<HTMLDivElement, SpinnerBtnProps>(({
    onClick=() => {}, children, color, type='submit', className='', isSquare=false, disabled=false, pending}, ref) => {

    return <div ref={ref} className={`relative ${className}`}>
        <Button type={type} className="w-full" isSquare={isSquare} disabled={disabled} onClick={onClick} color={color}>{children}</Button>
        {pending && <MiniSpinner white={color === 'whiteOutline'} absolute />}
    </div>
})