import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig(({ command, mode }) => {
    // Development server configuration
    return {
        plugins: [
            // ... other plugins
            ...VitePluginNode({
                adapter: 'express',
                appPath: './src/server.ts',
                exportName: 'viteNodeApp',
                optimizeDeps: {
                    exclude: ['common-utils'],
                }
            }),
        ],
        resolve: {
            alias: {
                'common-utils': '../common-utils/dist/index.mjs',
            }
        },
        server: {
            port: 3030
        },
    };
});
