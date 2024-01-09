/*
 * @Author: theajack
 * @Date: 2023-04-05 20:10:30
 * @Description: Coding something
 */
import { defineStore } from 'pinia';
import { createAppDataStore } from '@/ui/store/common';

export interface IFileInfo {
    name: string,
    isDir: boolean,
    id: number,

    modTime: string,
    size: number,
    kind: string,
}

export const createFinderStore = createAppDataStore(id => {
    return defineStore(`finder-store-${id}`, {
        state: () => {
            let id = 0;
            return {
                leftPanelWidth: 150,
                activeFinderItemName: '',
                curDirName: 'Home Dir',
                curDirInfo: [
                    {
                        id: id++,
                        name: 'test1',
                        isDir: true
                    }, {
                        id: id++,
                        name: 'test2',
                        isDir: false
                    },
                    {
                        id: id++,
                        name: 'test1',
                        isDir: true
                    }, {
                        id: id++,
                        name: 'test2',
                        isDir: false
                    },
                    {
                        id: id++,
                        name: 'test1',
                        isDir: true
                    }, {
                        id: id++,
                        name: 'test2',
                        isDir: false
                    },
                    {
                        id: id++,
                        name: 'test1',
                        isDir: true
                    }, {
                        id: id++,
                        name: 'test2',
                        isDir: false
                    },
                    {
                        id: id++,
                        name: 'test1',
                        isDir: true
                    }, {
                        id: id++,
                        name: 'test2',
                        isDir: false
                    },
                    {
                        id: id++,
                        name: 'test1',
                        isDir: true
                    }, {
                        id: id++,
                        name: 'test2',
                        isDir: false
                    },
                    {
                        id: id++,
                        name: 'test1',
                        isDir: true
                    }, {
                        id: id++,
                        name: 'test2',
                        isDir: false
                    },
                    {
                        id: id++,
                        name: 'test1',
                        isDir: true
                    }, {
                        id: id++,
                        name: 'test2',
                        isDir: false
                    },
                ] as IFileInfo[]
            };
        },
    });
});