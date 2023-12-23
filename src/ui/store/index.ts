/*
 * @Author: theajack
 * @Date: 2023-04-05 20:10:30
 * @Description: Coding something
 */
import { defineStore, acceptHMRUpdate } from 'pinia';
// import { ref } from 'vue';

export const useStore = defineStore('store', {
    state: () => ({
        showAuthBool: false,
    }),

    actions: {
    },
    getters: {
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}