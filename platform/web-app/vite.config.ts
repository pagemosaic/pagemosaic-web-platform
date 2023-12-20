import path from 'path';
import {readFileSync} from "fs";
import {unstable_vitePlugin as remix} from "@remix-run/dev";
import {defineConfig} from "vite";

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const infraPkg = JSON.parse(readFileSync('../infra/package.json', 'utf8'));

export default defineConfig({
    root: './',
    define: {
        'process.env.STACK_NAME': JSON.stringify(process.env.STACK_NAME || ''),
    },
    build: {
        minify: false,
        rollupOptions: {
            external: [
                ...Object.keys(pkg.devDependencies || {}),
                ...Object.keys(infraPkg.devDependencies || {})
            ]
        }
    },
    resolve: {
        alias: {
            'infra-common': path.resolve(__dirname, '../infra/src/common'),
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
