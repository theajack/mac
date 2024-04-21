/*
 * @Author: theajack
 * @Date: 2023-04-05 20:10:30
 * @Description: Coding something
 */
import { defineStore } from 'pinia';
import { createAppDataStore } from '@/ui/store/common';
import { getDisk } from '@/core/os/os';
import { Path, type FileBase } from 'webos-term';

export interface IFileInfo {
    name: string,
    isDir: boolean,
    id: number|string,

    path: string,

    // file: FileBase,
    // modTime: string,
    // size: number,
    // kind: string,
}

export async function loadFilesInDir (path: string) {
    const dir = await getDisk().findDirByPath(path);
    if (!dir) {
        throw new Error('目录不存在');
    }
    return dir.children;
}

export function generateFilesData (files: FileBase[]): IFileInfo[] {
    return files.map(file => {
        return {
            id: file.id,
            name: file.name,
            isDir: file.isDir,
            path: file.path.path,
        };
    });
}

export const useFinderStore = createAppDataStore(id => {
    return defineStore(`finder-store-${id}`, {
        state: () => {
            return {
                leftPanelWidth: 150,
                activeFinderItemName: '',
                curDirName: 'Home Dir',
                activeIds: new Set() as Set<string>,
                curDirInfo: [] as IFileInfo[],
            };
        },
        actions: {
            chooseSingleFile (id: string) {
                this.activeIds.clear();
                this.activeIds.add(id);
            },

            async entryDir (path: string) {
                // const files = await loadFilesInDir(path);
                // this.curDirInfo = generateFilesData(files);
                // this.curDirName = parseDirName(path);

                this.curDirInfo = mockFilesInfo();
            },
        }
    });
});

export async function getFileContent (path: string) {
    const file = await getDisk().findFileByPath(path);
    if (!file) {
        throw 'file not exist' + path;
    }
    return file?.contentString;
}

function parseDirName (path: string) {
    return Path.from(path).last || 'Home';
}


window.parseDirName = parseDirName;
window.useFinderStore = useFinderStore;

function mockFilesInfo () {
    let id = 0;
    return [
        {
            id: `${id++}`,
            name: 'test1',
            isDir: true
        }, {
            id: `${id++}`,
            name: 'looooooooooooooooog name test',
            isDir: true
        },
        {
            id: `${id++}`,
            name: 'test1',
            isDir: false
        }, {
            id: `${id++}`,
            name: 'test2',
            isDir: false
        },
        {
            id: `${id++}`,
            name: 'test1',
            isDir: false
        }, {
            id: `${id++}`,
            name: 'test2',
            isDir: false
        },
        {
            id: `${id++}`,
            name: 'test1',
            isDir: true
        }, {
            id: `${id++}`,
            name: 'test2',
            isDir: false
        },
        {
            id: `${id++}`,
            name: 'test1',
            isDir: true
        }, {
            id: `${id++}`,
            name: 'test2',
            isDir: false
        },
        {
            id: `${id++}`,
            name: 'test1',
            isDir: true
        }, {
            id: `${id++}`,
            name: 'test2',
            isDir: false
        },
        {
            id: `${id++}`,
            name: 'test1',
            isDir: true
        }, {
            id: `${id++}`,
            name: 'test2',
            isDir: false
        },
        {
            id: `${id++}`,
            name: 'test1',
            isDir: true
        }, {
            id: `${id++}`,
            name: 'test2',
            isDir: false
        },
    ] as IFileInfo[];
}