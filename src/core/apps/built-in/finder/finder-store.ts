/*
 * @Author: theajack
 * @Date: 2023-04-05 20:10:30
 * @Description: Coding something
 */
import { defineStore } from 'pinia';
import { createAppDataStore } from '@/ui/store/common';


export const createFinderStore = createAppDataStore(id => {
    return defineStore(`finder-store-${id}`, {
        state: () => ({
            leftPanelWidth: 150,
            activeFinderItemName: '',
        }),
    });
});