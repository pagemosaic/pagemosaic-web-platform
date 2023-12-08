import { defineConfig } from 'vite';
import path from "path";
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
    port: 8080,
  },
})
