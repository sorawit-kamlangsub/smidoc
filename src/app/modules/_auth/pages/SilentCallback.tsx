import { UserManager, UserManagerSettings, WebStorageStateStore } from "oidc-client-ts";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SSO_CONFIG } from "../../../../Const";

const SilentCallback = () => {
    const location = useLocation();

    useEffect(() => {
        const processSignIn = async () => {
            const userManagerSettings: UserManagerSettings = {
                ...SSO_CONFIG,
                loadUserInfo: true,
                response_type: "code",
                disablePKCE: false,
                userStore: new WebStorageStateStore({
                    store: window.localStorage,
                }),
            };

            const oidcUserManager = new UserManager(userManagerSettings);
            await oidcUserManager.signinSilentCallback(location.search);
        };

        processSignIn();
    }, [location.pathname === "/silent-callback"]);

    return <></>;
};

export default SilentCallback;
