import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { SSO_CONFIG } from "./Const";
import Layout from "./app/layout/Layout";
import { AuthProvider, NoticePage } from "./app/modules/_auth";
import Home from "./app/pages/Home";
import { AuthRoutes, RouteMapType, createRouteObject } from "./app/routes";
import Routes from "./app/routes/Routes";

function App() {
    const oidcUserManager = new UserManager({
        ...SSO_CONFIG,
        loadUserInfo: true,
        response_type: "code",
        automaticSilentRenew: true,
        userStore: new WebStorageStateStore({ store: window.localStorage }),
        monitorSession: true,
    });

    const CombineRouteConfig: RouteMapType[] = [
        ...AuthRoutes,
        {
            path: "/",
            element: (
                <AuthProvider oidcUserManager={oidcUserManager}>
                    <Layout />
                </AuthProvider>
            ),
            title: "Home",
            children: [
                { index: true, title: "Home", element: <Home /> },
                {
                    path: "/unauthorized",
                    title: "Unauthorized",
                    element: <NoticePage title="401 Unautorized" body="คุณไม่มีสิทธ์ เข้าถึงหน้านี้" />,
                },
                ...Routes,
            ],
        },
        {
            path: "*",
            title: "Not Found",
            element: <Navigate to="/not-found" />,
        },
    ];

    const routeObjects = CombineRouteConfig.map((route) => createRouteObject(route));

    const router = createBrowserRouter(routeObjects, {
        basename: "/",
    });

    return <RouterProvider router={router} />;
}

export default App;
