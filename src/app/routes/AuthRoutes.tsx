import { Navigate, RouteObject } from "react-router-dom";
import { PermissionList } from "../../Const";
import { NoticePage, PermissionCondition, SigninCallback, SilentCallback } from "../modules/_auth";

/**
 * ใช้ในการกำหนด ข้อมูล ของ route
 **/
export type RouteMapType = {
    /**
     * รายการของ route ย่อย
     **/
    children?: RouteMapType[];
} & Omit<RouteObject, "children" | "handle"> &
    RouteHandleType;

/**
 * ใช้ในการกำหนด ข้อมูล ของ route handle
 */
export type RouteHandleType = {
    /**
     * ชื่อของหน้า
     **/
    title: string;

    /**
     * สิทธิ์การเข้าถึงหน้า (ถ้าไม่มี จะไม่มีการเช็คสิทธิ์)
     * ตั้งค่าที่ Const.ts
     **/
    permissions?: PermissionList[];

    /**
     * เงื่อนไขการเช็คสิทธิ์ (ถ้าไม่มี จะเช็คแบบ OR)
     **/
    condition?: PermissionCondition;
};

export const createRouteObject = (route: RouteMapType): RouteObject => {
    if (route.index) {
        return {
            index: route.index,
            element: route.element,
            handle: {
                title: route.title ?? undefined,
                permissions: route.permissions ?? undefined,
                condition: route.condition ?? undefined,
            },
        };
    }

    return {
        path: route.path ?? undefined,
        element: route.element ?? false,
        children: route.children?.map((child) => createRouteObject(child)) ?? undefined,
        handle: {
            title: route.title ?? undefined,
            permissions: route.permissions ?? undefined,
            condition: route.condition ?? undefined,
        },
    };
};

export const AuthRoutes: RouteMapType[] = [
    { path: "/home", title: "Home", element: <Navigate to="/" /> },
    {
        path: "/signin-callback",
        title: "Signin Callback",
        element: <SigninCallback />,
    },
    {
        path: "/silent-callback",
        title: "Silent Callback",
        element: <SilentCallback />,
    },
    {
        path: "/not-found",
        title: "Not Found",
        element: <NoticePage title="404 Not Found" body="ไม่พบเพจที่คุณต้องการ" />,
    },
];
