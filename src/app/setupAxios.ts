import { AxiosInstance } from "axios";
import { useAuth } from "./modules/_auth";

export default function setupAxios(axios: AxiosInstance) {
    const { authTokens } = useAuth();
    axios.interceptors.request.use(
        (config) => {
            if (authTokens) {
                config.headers.Authorization = `Bearer ${authTokens}`;
                config.headers["Access-Control-Allow-Origin"] = "*";
            }

            return config;
        },
        (err) => {
            Promise.reject(err);
        }
    );
}
