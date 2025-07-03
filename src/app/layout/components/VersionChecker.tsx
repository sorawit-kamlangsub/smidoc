import React, { useEffect } from "react";
import { APP_INFO, VERSION_CHECKER } from "../../../Const";
import { swalConfirm } from "../../modules/_common";

function VersionChecker() {
    const { version } = APP_INFO;
    const { CHECK_VERSION_EVERY_MINUTE, CONFIRM_BEFORE_REFRESH, ENABLE_VERSION_CHECKER } = VERSION_CHECKER;

    const checkVersionLoop = 1000 * 60 * CHECK_VERSION_EVERY_MINUTE;

    const getData = async () => {
        if (ENABLE_VERSION_CHECKER) {
            try {
                const response = await fetch(`${window.location.origin}/config.json`, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                const configData = await response.json();

                if (configData.version !== version) {
                    if (CONFIRM_BEFORE_REFRESH) {
                        swalConfirm("Warning", "your version is out-dated, refresh now?").then((res) => {
                            if (res.isConfirmed) {
                                emptyCache();
                            }
                        });
                    } else {
                        emptyCache();
                    }
                }
            } catch (error) {
                alert("config file not found");
            }
        }
    };

    const emptyCache = () => {
        if ("caches" in window) {
            caches.keys().then((names) => {
                // Delete all the cache files
                names.forEach((name) => {
                    caches.delete(name);
                });
            });

            // Makes sure the page reloads. Changes are only visible after you refresh.
            window.location.reload();
        }
    };

    useEffect(() => {
        getData();
        const interval = setInterval(() => {
            getData();
        }, checkVersionLoop);

        // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
        return () => clearInterval(interval);
    }, []);

    return <React.Fragment />;
}

export default VersionChecker;
