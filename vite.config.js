
/*
 * @Author: tackchen
 * @Date: 2022-09-05 08:45:44
 * @Description: Coding something
 */
import { defineConfig } from 'vite';
// loadEnv
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        // base: isDev ? '/' : '/',
        plugins: [
            legacy({
                targets: [ 'defaults', 'not IE 11' ],
            }),
            vue(),
        ],
        server: {
            port: 3001,
        },
        define: {
            __DEV__: mode === 'development',
        },
        base: '/mac',
        build: {
            rollupOptions: {
                output: {
                    dir: 'docs'
                },
            },
            outDir: 'docs',
        },
        resolve: {
            alias: {
                '@': '/src/',      // 格式一定要写对喽不然没有代码提示或者报错
                '@core': '/src/core/',
            }
        },
    };
});
