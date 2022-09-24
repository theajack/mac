/*
 * @Author: tackchen
 * @Date: 2022-09-05 08:45:44
 * @Description: Coding something
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ vue() ],
    build: {
        rollupOptions: {
            output: {
                dir: 'docs'
            }
        }
    },
    resolve: {
        alias: {
            '@': '/src/',      // 格式一定要写对喽不然没有代码提示或者报错
            '@core': '/src/core/',
        }
    }
});
