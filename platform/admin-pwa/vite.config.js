import {defineConfig} from 'vite';
import path from "path";
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    if (command === 'serve') {
        return {
            base: '/admin/',
            plugins: [react()],
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, "./src"),
                    'common-utils': path.resolve(__dirname, '../common-utils/dist/index.mjs')
                },
            },
            server: {
                host: '0.0.0.0',
                cors: {
                    origin: '*'
                },
                port: 8080,
                proxy: {
                    '/api': 'http://localhost:3030',
                }
            },
            preview: {
                host: '0.0.0.0',
                cors: {
                    origin: '*'
                },
                port: 8080,
                proxy: {
                    '/api': 'http://localhost:3030',
                }
            },
        };
    }
    return {
        base: '/admin/',
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, "./src")
            },
        },
        server: {
            host: '0.0.0.0',
            port: 8080,
        },
        preview: {
            host: '0.0.0.0',
            port: 8080,
        },
    };
});
