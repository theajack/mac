/*
 * @Author: theajack
 * @Date: 2023-04-05 20:10:30
 * @Description: Coding something
 */
import { defineStore } from 'pinia';
import { createAppDataStore } from '@/ui/store/common';

export const useTextEditStore = createAppDataStore(id => {
    return defineStore(`text-edit-store-${id}`, {
        state: () => {
            return {
                isEdit: false,
                content: `function main () {
    console.log("Hello World");
}`,
            };
        },
        actions: {
        }
    });
});
