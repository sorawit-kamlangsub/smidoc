import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import dayjs from "dayjs";
import th from "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import timezone from "dayjs/plugin/timezone";

import App from "./App";
import { VITE_APP_NAME, VITE_APP_VERSION } from "./Const";
import { ReduxProvider } from "./redux";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

dayjs.locale(th);
dayjs.extend(buddhistEra);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

library.add(fas);
library.add(fab);

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            retryDelay: 5000,
            staleTime: 1000 * 60 * 5,
        },
    },
});

const AppRoot = () => {
    console.log(
        `%c${VITE_APP_NAME} v${VITE_APP_VERSION}\n%cPowered by Smile Solution Development 2023`,
        "color: #1976d2; font-size: 24px;",
        "font-size: 14px;"
    );

    return (
        <ReduxProvider>
            <QueryClientProvider client={queryClient}>
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ReduxProvider>
    );
};

export default AppRoot;
