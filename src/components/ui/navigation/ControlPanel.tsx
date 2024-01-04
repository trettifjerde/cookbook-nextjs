import { logOut } from "@/helpers/server-actions/auth-actions";
import getUserId from "@/helpers/cachers/token";

import NavLink from "./NavLink";
import NavLi from "./NavLi";
import SubmitButton from "../elements/SubmitButton";

export default async function ControlPanel() {
    console.log('about to get userId: control panel');
    const userId = getUserId();

    if (userId) 
        return <>
            <NavLink name="Shopping List" url="/list" />
            <NavLi>
                <form action={logOut}>
                    <SubmitButton color="transparent" className="*:p-3">Log out</SubmitButton>
                </form>
            </NavLi>
        </>
    else 
        return <NavLink name="Sign in" url="/auth/login"/>
}