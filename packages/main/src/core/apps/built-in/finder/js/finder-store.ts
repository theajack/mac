/*
 * @Author: theajack
 * @Date: 2023-04-05 20:10:30
 * @Description: Coding something
 */
import { defineStore } from 'pinia';
import { createAppDataStore } from '@/ui/store/common';
import { getDisk, getOS } from '@/core/os/os';
import type { Dir } from 'webos-term';
import { Path, type FileBase, FileUtils } from 'webos-term';
import { useHistory } from '@/lib/history';
import { nextTick } from 'vue';
import { selectTextInput } from 'webos-utils';
import { StringText } from '@/core/string';

export interface IFileInfo {
    name: string,
    isDir: boolean,
    // id: number,
    id: string,

    path: string,
    isEdit: boolean,
    isSystemFile: boolean,

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
            path: file.pathString,
            isSystemFile: file.isSystemFile,
            curIndex: -1,
            isEdit: false,
        };
    });
}

export const useFinderStore = createAppDataStore(id => {
    const history = useHistory()(id);
    return defineStore(`finder-store-${id}`, {
        state: () => {
            return {
                id,
                leftPanelWidth: 150,
                activeFinderItemName: '',
                curDirName: '',
                activeIds: new Set() as Set<string>,
                curDirInfo: [] as IFileInfo[],
                historyIndex: 0,
            };
        },
        getters: {
            canBack (state) {
                return state.historyIndex > 0;
            },
            canForward (state) {
                return state.historyIndex < history.size - 1;
            },
        },
        actions: {
            async saveFileName (e: Event, file: IFileInfo) {
                file.isEdit = false;
                // @ts-ignore
                let value = e.target?.innerText;
                if (value === file.name) return;
                const targetFile = await getOS().disk.findChildByPath(file.path);
                if (value === '') {
                    // @ts-ignore
                    value = FileUtils.ensureFileRepeatName('untitled_folder', targetFile?.parent?.children);
                }
                file.name = value;
                console.log(`targetFile rename, old=${targetFile?.name} new=${value}`);
                await targetFile?.rename(value);
                // ! 更新file.path
                file.path = targetFile?.pathString || '';
            },

            chooseSingleFile (id: string) {
                this.clearSelect();
                this.activeIds.add(id);
            },

            clearSelect () {
                this.activeIds.clear();
            },

            async entryDir (path: string) {
                await this.refreshDirInfo(path);
                this.historyIndex = history.add(path);
                // this.curDirInfo = mockFilesInfo();
            },
            async refreshDirInfo (path?: string) {
                if (!path) {
                    path = this.getCurPath();
                }
                const files = await loadFilesInDir(path);
                this.curDirInfo = generateFilesData(files);
                this.curDirName = parseDirName(path);
            },
            back () {
                this.clearSelect();
                this.historyIndex = history.back();
                this.refreshDirInfo(history.current);
            },
            forward () {
                this.clearSelect();
                this.historyIndex = history.forward();
                this.refreshDirInfo(history.current);
            },
            getCurPath () {
                return history.current;
            },
        },
    });
});

export async function getFileContent (path: string) {
    const file = await getDisk().findFileByPath(path);
    if (!file) {
        throw 'file not exist' + path;
    }
    return await file.readText();
}

function parseDirName (path: string) {
    return Path.from(path).last || 'Home';
}


// window.parseDirName = parseDirName;
// window.useFinderStore = useFinderStore;

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

export const FinderUtils = {
    getStore () {
        const id = getOS().currentWindow?.id;
        if (typeof id !== 'number') return null;
        return useFinderStore(id);
    },
    async getCurDir (): Promise<Dir> {
        const store = this.getStore();
        const path = store!.getCurPath();
        const os = getOS();
        return await os.disk.findDirByPath(path) as Dir;
    },
    async getSelectedFiles (): Promise<FileBase[]> {
        const store = this.getStore();
        const dir = await this.getCurDir();
        return dir.children.filter(child => {
            return store!.activeIds.has(child.id);
        });
    },
    async editFile (fileId?: string) {
        const store = this.getStore()!;
        if (fileId) {
            store.chooseSingleFile(fileId);
        } else {
            if (store.activeIds.size > 0) {
                fileId = store.activeIds.values().next().value;
                if (store.activeIds.size > 1) {
                    store.chooseSingleFile(fileId!);
                }
            } else {
                throw new Error(`edit file error`);
            }
        }
        const file = store.curDirInfo.find(file => file.id === fileId);
        if (!file) {
            throw new Error(`edit file error`);
        }
        file.isEdit = true;
        await nextTick();
        const nameInput = document.getElementById(`file-name-input-${store.id}-${fileId}`)!;
        selectTextInput(nameInput);
    },
    async newFile (isDir = false) {
        const store = FinderUtils.getStore()!;
        const dir = await FinderUtils.getCurDir();
        const name = FileUtils.ensureFileRepeatName(`Untitled${isDir ? '_folder' : ''}`, dir.children);
        const target = await dir[isDir ? 'createDir' : 'createFile']({ name });
        await store.refreshDirInfo();
        store.chooseSingleFile(target!.id);
        this.editFile();
    },


    isInTrash (path: string) {
        return path === StringText.trashDir || path.startsWith(`${StringText.trashDir}/`);
    },

    isFileLocked (isSystemFile: boolean, path: string) {
        return isSystemFile || this.isInTrash(path);
    },
};
