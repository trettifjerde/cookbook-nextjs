import getUserId from "@/helpers/server/cachers/token";

import NavLink from "./NavLink";
import NavLi from "./NavLi";
import SubmitButton from "../elements/SubmitButton";
import NavLinkText from "./NavLinkText";
import { logOut } from "@/helpers/server/server-actions/auth-actions";

export default async function ControlPanel() {
    const userId = getUserId();

    if (userId) 
        return <>
            <NavLink animate name="Shopping List" icon="icon-cart" url="/list" />
            <NavLi animate>
                <form action={logOut}>
                    <SubmitButton color="borderless" shape="none">
                        <NavLinkText text="Log out" icon="icon-exit"/>
                    </SubmitButton>
                </form>
            </NavLi>
        </>
    else 
        return <NavLink animate name="Sign in" icon="icon-enter" url="/auth/login"/>
}