import react from "@vitejs/plugin-react";
import { writeFile } from "fs";
import { UserConfigExport, defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    const {
        VITE_APP_NAME,
        VITE_APP_VERSION,
        VITE_APP_DESCRIPTION,
        VITE_BASE_URL,
        VITE_APP_SINCE,
        VITE_APP_CONTACT_URL,
    } = env;

    const APP_INFO = {
        name: VITE_APP_NAME,
        version: VITE_APP_VERSION,
        since: VITE_APP_SINCE,
        description: VITE_APP_DESCRIPTION,
        contactUrl: VITE_APP_CONTACT_URL,
    };

    const __CONST__ENV__: Record<string, string> = {
        ...Object.fromEntries(Object.entries(env).filter(([k]) => k.startsWith("VITE_"))),
        MODE: mode,
    };

    createConfig(APP_INFO);
    createConst(__CONST__ENV__);

    const config: UserConfigExport = {
        plugins: [react()],
        base: VITE_BASE_URL || "/", // ใช้ path เช่น /my-repo/
        server: {
            port: 3000,
            open: true,
        },
        build: {
            outDir: "dist", // ✅ เปลี่ยนจาก dynamic path เป็น dist แบบคงที่
            emptyOutDir: true,
            rollupOptions: {
                output: {
                    entryFileNames: `assets/js/[name].[hash].js`,
                    assetFileNames: `assets/[ext]/[name].[hash].[ext]`,
                    chunkFileNames: `assets/js/[name].js`,
                },
            },
        },
    };

    console.log(`\n✅ Environment: ${mode}`);
    console.log(`📦 Build output: dist`);
    console.log(`🌐 Base URL: ${config.base}`);

    return config;
});

function createConfig(appInfo) {
    writeFile("./public/config.json", JSON.stringify(appInfo), function (err) {
        if (err) throw err;
        console.log("✅ ./public/config.json created!");
    });
}

function createConst(env: Record<string, string>) {
    const windowConf = `window.__CONST__ENV__`;
    const configStr = `${windowConf} = ${JSON.stringify(env, null, 2)};
Object.freeze(${windowConf});
Object.defineProperty(window, "__CONST__ENV__", {
    configurable: false,
    writable: false,
});`;

    writeFile("./public/configuration.js", configStr, function (err) {
        if (err) throw err;
        console.log("✅ ./public/configuration.js created!");
    });
}
