import { logOut } from "@/helpers/auth-actions";
import NavLink from "./navigation/NavLink";
import SubmitButton from "./SubmitButton/SubmitButton";
import { verifyToken } from "@/helpers/server-helpers";
import { cookies } from "next/headers";
import NavLi from "./navigation/NavLi";

export default async function ControlPanel() {
    const userId = verifyToken(cookies(), 'ControlPanel');

    if (userId) 
        return <>
            <NavLink name="Shopping List" url="/list" />
            <NavLi>
                <form action={logOut}>
                    <SubmitButton className="nav-link">Log out</SubmitButton>
                </form>
            </NavLi>
        </>
    else 
        return <NavLink name="Sign in" url="/auth/login"/>
}