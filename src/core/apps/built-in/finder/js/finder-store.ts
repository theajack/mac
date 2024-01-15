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

export const useFinderStore = createAppDataStore(id => {
    return defineStore(`finder-store-${id}`, {
        state: () => {
            let id = 0;
            return {
                leftPanelWidth: 150,
                activeFinderItemName: '',
                curDirName: 'Home Dir',
                activeIds: new Set() as Set<number>,
                curDirInfo: [
                    {
                        id: id++,
                        name: 'test1',
                        isDir: true
                    }, {
                        id: id++,
                        name: 'looooooooooooooooog name test',
                        isDir: true
                    },
                    {
                        id: id++,
                        name: 'test1',
                        isDir: false
                    }, {
                        id: id++,
                        name: 'test2',
                        isDir: false
                    },
                    {
                        id: id++,
                        name: 'test1',
                        isDir: false
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
        actions: {
            chooseSingleFile (id: number) {
                this.activeIds.clear();
                this.activeIds.add(id);
            }
        }
    });
});