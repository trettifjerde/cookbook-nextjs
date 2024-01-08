import { logOut } from "@/helpers/server-actions/auth-actions";
import getUserId from "@/helpers/cachers/token";

import NavLink from "./NavLink";
import NavLi from "./NavLi";
import SubmitButton from "../elements/SubmitButton";
import NavLinkText from "./NavLinkText";

export default async function ControlPanel() {
    const userId = getUserId();

    if (userId) 
        return <>
            <NavLink animate name="Shopping List" icon="icon-cart" url="/list" />
            <NavLi animate>
                <form action={logOut}>
                    <SubmitButton color="transparent" shape="none">
                        <NavLinkText text="Log out" icon="icon-exit"/>
                    </SubmitButton>
                </form>
            </NavLi>
        </>
    else 
        return <NavLink animate name="Sign in" icon="icon-enter" url="/auth/login"/>
}