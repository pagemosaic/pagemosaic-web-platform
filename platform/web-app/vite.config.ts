import path from 'path';
import {unstable_vitePlugin as remix} from "@remix-run/dev";
import {defineConfig} from "vite";

export default defineConfig({
    root: './',
    build: {
        minify: false
    },
    resolve: {
        alias: {
            'common-utils': '../common-utils/dist/index.mjs',
            '~': path.resolve(__dirname, './app'),
        }
    },
    publicDir: 'public',
    plugins: [
        remix({
            appDirectory: "app",
            assetsBuildDirectory: "static",
            publicPath: "/static/"
        }),
    ],
    server: {
        host: '0.0.0.0',
        cors: {
            origin: '*'
        },
        port: 3000,
    }
});
