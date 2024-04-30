/*
 * @Author: tackchen
 * @Date: 2022-09-04 08:16:09
 * @Description: Coding something
 */
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/home.vue';
import Desktop from '../views/desktop.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Desktop',
        component: Desktop
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    // {
    //     path: '/about',
    //     name: 'About',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ '../views/about.vue')
    // }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
