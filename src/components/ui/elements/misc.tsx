export function ErrorMessage({text}: {text: string | false}) {
    return <p className="text-red text-right text-xs min-h-error-msg my-1">{text || ''}</p>
}

export function Note({text, className}: {text: string|false, className?: string}) {
    return <p className={`text-gray-500 text-xs min-h-error-msg ${className || ''}`}>{text || ''}</p>
}

export default function MiniSpinner({white, absolute}: {white?: boolean, absolute?: boolean}) {
    return <div className={`flex items-center justify-center ${absolute ? 'absolute inset-0' : ''}`}>
        <div className={`animate-spin relative w-6 h-6 m-auto border-4 rounded-full border-radius ${white ? 'border-white' : 'border-green'} border-t-transparent`}></div>
    </div>
}

export function HR() {
    return <hr className="w-full h-px border-none bg-gray-200 my-6"/>
}