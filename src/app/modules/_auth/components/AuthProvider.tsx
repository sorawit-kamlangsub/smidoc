import { User, UserManager } from "oidc-client-ts";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../auth";
import { CustomClaims, UserProperties } from "../auth.d";

export type AuthProviderProps = {
    children: React.ReactNode;
    oidcUserManager: UserManager;
};

const CheckArray = (source: string | string[] | undefined | null): string[] => {
    if (source === undefined || source === null) {
        return [];
    }

    if (Array.isArray(source)) {
        return source;
    }

    return [source];
};

export const AuthProvider = ({ children, oidcUserManager }: AuthProviderProps) => {
    const location = useLocation();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authTokens, setAuthTokens] = useState<string>("");
    const [roles, setRoles] = useState<string[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProperties | null>(null);

    const setLogin = (user: User) => {
        const profile = user.profile as CustomClaims;

        const roles = CheckArray(profile.role);
        const permissions = CheckArray(profile.permission);
        const userProfile: UserProperties = {
            userId: profile.user_id,
            userName: profile.Username,
            email: profile.email,
            employeeId: profile.Employee_ID,
            employeeCode: profile.EmployeeCode,
            personId: profile.Person_ID,
            fullName: profile.FullName,
            firstName: profile.FirstName,
            lastName: profile.LastName,
            branchId: profile.Branch_ID,
            branchDetail: profile.BranchDetail,
            areaId: profile.Area_ID,
            areaDetail: profile.AreaDetail,
            departmentId: profile.Department_ID,
            departmentDetail: profile.DepartmentDetail,
            teamId: profile.EmployeeTeam_ID,
            teamDetail: profile.EmployeeTeamDetail,
            positionId: profile.EmployeePosition_ID,
            positionDetail: profile.EmployeePositionDetail,
        };

        setIsAuthenticated(true);
        setAuthTokens(user.access_token);
        setRoles(roles);
        setPermissions(permissions);
        setUser(user);
        setUserProfile(userProfile);
    };

    const setLogout = () => {
        setIsAuthenticated(false);
        setAuthTokens("");
        setRoles([]);
        setPermissions([]);
        setUser(null);
        setUserProfile(null);
    };

    const getState = () => {
        const returnUrl = location.pathname + location.search;

        return { returnUrl: returnUrl };
    };

    oidcUserManager.events.addAccessTokenExpired(() => {
        oidcUserManager.removeUser();
        oidcUserManager.clearStaleState();
        oidcUserManager.signinRedirect({ state: getState() });
    });

    oidcUserManager.events.addUserLoaded((user) => {
        setLogin(user);
    });

    oidcUserManager.events.addUserUnloaded(() => {
        setLogout();
    });

    oidcUserManager.events.addUserSignedOut(() => {
        oidcUserManager.removeUser();
        oidcUserManager.clearStaleState();
        oidcUserManager.signinRedirect({ state: getState() });
    });

    oidcUserManager.events.addAccessTokenExpiring(() => {
        oidcUserManager.startSilentRenew();
    });

    useEffect(() => {
        const processGetUser = async () => {
            const user = await oidcUserManager.getUser();
            if (user) {
                setLogin(user);
                oidcUserManager.clearStaleState();
            } else {
                setLogout();
                await oidcUserManager.signinRedirect({ state: getState() });
            }
        };

        processGetUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                authTokens,
                roles,
                permissions,
                user,
                userProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
