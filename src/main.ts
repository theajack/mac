/*
 * @Author: tackchen
 * @Date: 2022-09-04 08:03:02
 * @Description: Coding something
 */
import { createApp } from 'vue';
import { Desktop } from './core/desktop';
import Entry from './entry.vue';
import router from './router';
import store from './store';

const desktop = new Desktop();

createApp(Entry)
    .use(store)
    .use(router)
    .use(desktop)
    .mount('#app');
