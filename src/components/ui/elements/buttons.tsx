import Link from "next/link";
import { MouseEventHandler, ReactNode, forwardRef } from "react";
import MiniSpinner from "./misc";

const shapes = {
    square: 'min-w-btn-square p-2 aspect-square',
    normal: 'px-3 py-2',
    small: 'text-sm px-2 py-1',
    filler: 'min-h-btn-square min-w-btn-square',
    none: '',
};

const colors = {
    green: 'text-white bg-green border-green hover:bg-green-hover active:bg-green-active disabled:hover:bg-green',
    red: 'text-white bg-red border-red hover:bg-red-hover active:bg-red-active disabled:hover:bg-red',
    yellowOutline: 'bg-white text-amber-500 border-amber-500 hover:bg-amber-500 hover:text-white',
    greenOutline: 'bg-white text-green border-green hover:bg-green hover:text-white active:bg-green-hover',
    redOutline: 'bg-white text-red border-red hover:bg-red hover:text-white active:bg-red-hover',
    whiteOutline: 'text-white border-white hover:bg-white-shadow active:bg-white-overlay hover:text-white',
    transparent: 'text-transparent border-none',
    borderless: 'text-green border-none'
};

export type BtnColor = keyof typeof colors;
export type BtnShape = keyof typeof shapes;

type BtnProps = {
    children: ReactNode, 
    color: BtnColor,
    shape?: BtnShape,
    onClick?: MouseEventHandler,
    className?: string, 
    type?: 'submit'|'button',
    disabled?: boolean,
    title?: string
}

type SpinnerBtnProps = BtnProps & {pending: boolean};

const classes = {
    base: 'border border-solid rounded-md transition disabled:opacity-50 whitespace-nowrap duration-300',
    shapes,
    colors,
    get(color: BtnColor, shape: BtnShape, className?: string) {
        return `${this.base} ${this.colors[color]} ${this.shapes[shape]} ${className ? className : ''}`
    }
};

export const Button = forwardRef<HTMLButtonElement, BtnProps>((
    {children, color, type='submit', className='', shape='normal', disabled=false, title="", onClick=() => {}}, 
    ref) => {
    return <button ref={ref} type={type} onClick={onClick} disabled={disabled}
        className={classes.get(color, shape, className)} title={title}>
            {children}
    </button>
})

export const FillerButton = () => {
    return <div className={classes.get('transparent', 'filler')}></div>
}
export const SmallButton = ({onClick, color, children}: {onClick: MouseEventHandler, color: BtnColor, children: ReactNode}) => {
    return <Button type="button" onClick={onClick} color={color} shape="small">{children}</Button>
}

export function LinkButton({url, color, children, className=''}: {url: string, color: BtnColor, children: ReactNode, className?: string}) {
    return <Link href={url} className={`text-center ${classes.get(color, 'normal', className)}`}>{children}</Link>
}

export const SpinnerButton = forwardRef<HTMLDivElement, SpinnerBtnProps>(({
    onClick, children, color, shape, type, disabled, pending, className='', title}, ref) => {

    return <div ref={ref} className={`relative ${className}`}>
        <Button type={type} onClick={onClick} disabled={disabled}
            color={color} shape={shape} className="w-full" title={title}>
                {children}
        </Button>
        {pending && <MiniSpinner white={color === 'whiteOutline'} absolute />}
    </div>
})