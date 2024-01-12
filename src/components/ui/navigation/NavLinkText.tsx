
export default function NavLinkText({icon, text}: {text: string, icon?: string}) {
    return <div className="py-3 px-4 text-green whitespace-nowrap">
        {icon && <i className={icon}/>}
        <span className="max-md:hidden">{text}</span>
    </div>
}