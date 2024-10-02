import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import svgr from 'vite-plugin-svgr';
import vitetsConfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    return {
        plugins: [
            react(),
            commonjs(),
            svgr(),
            vitetsConfigPaths(),
            eslint({
                lintOnStart: command === "build" ? true : false,
                failOnWarning: command === "build" ? true : false,
                failOnError: true,
            }),

        ],
        envPrefix: 'REACT_APP_',

        server: {
            open: true,
            port: 3000,
        },

        build: {
            outDir: 'build',
        },


        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
    }
});