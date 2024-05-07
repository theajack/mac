/*
 * @Author: tackchen
 * @Date: 2022-09-04 08:03:02
 * @Description: Coding something
 */
import { createApp } from 'vue';
import Entry from './entry.vue';
import { initFullscreen } from './lib/fullscreen';
import router from './router';
import { createPinia } from 'pinia';
import './style/common.less';
import './style/tailwind-output.css';

export function initUI (container: string) {

    initFullscreen();

    const app = createApp(Entry);
    app.use(router)
        .use(createPinia())
        .mount(container);
}

