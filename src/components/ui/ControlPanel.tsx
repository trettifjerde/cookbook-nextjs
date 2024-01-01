import { cookies } from "next/headers";
import { logOut } from "@/helpers/auth-actions";
import { verifyToken } from "@/helpers/server-helpers";
import NavLink from "./navigation/NavLink";
import NavLi from "./navigation/NavLi";
import SubmitButton from "./elements/SubmitButton";

export default async function ControlPanel() {
    const userId = verifyToken(cookies(), 'ControlPanel');

    if (userId) 
        return <>
            <NavLink name="Shopping List" url="/list" />
            <NavLi>
                <form action={logOut}>
                    <SubmitButton color="transparent" className="nav-link">Log out</SubmitButton>
                </form>
            </NavLi>
        </>
    else 
        return <NavLink name="Sign in" url="/auth/login"/>
}