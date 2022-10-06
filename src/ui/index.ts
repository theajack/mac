/*
 * @Author: tackchen
 * @Date: 2022-09-04 08:03:02
 * @Description: Coding something
 */
import { createApp } from 'vue';
import Entry from './entry.vue';
import router from './router';
import store from './store';
import './style/common.less';

export function initUI () {
    createApp(Entry)
        .use(store)
        .use(router)
        .mount('#app');
}

