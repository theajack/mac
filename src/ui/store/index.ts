/*
 * @Author: theajack
 * @Date: 2023-04-05 20:10:30
 * @Description: Coding something
 */
import { defineStore, acceptHMRUpdate } from 'pinia';
import { DeskTopMenuList } from '../components/common/context-menu/context-menu';
// import { ref } from 'vue';

export const useGlobalStore = defineStore('store', {
    state: () => ({
        windowMaxZIndex: -1,
        inDragging: false,
        deskTopMenuList: DeskTopMenuList,
        dockContextAppName: '',
    }),
    actions: {
        drag (bool = true) {
            this.inDragging = bool;
        },
        openDockAppMenu (name: string) {
            this.dockContextAppName = name;
        },
        closeDockAppMenu () {
            this.dockContextAppName = '';
        }
    },
    getters: {
    }
});

// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot));
}