
export default function NavLinkText({icon, text}: {text: string, icon?: string}) {
    return <>
        {icon && <i className={icon}/>}
        <span className="max-md:hidden">{text}</span>
    </>
}