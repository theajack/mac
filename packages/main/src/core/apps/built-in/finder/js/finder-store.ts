/*
 * @Author: theajack
 * @Date: 2023-04-05 20:10:30
 * @Description: Coding something
 */
import { defineStore } from 'pinia';
import { createAppDataStore } from '@/ui/store/common';
import { getDisk, getOS } from '@/core/os/os';
import { Path, type FileBase, FileUtils } from 'webos-term';
import { useHistory } from '@/lib/history';
import { FinderUtils } from './finder-utils';

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

export const useFinderStore = createAppDataStore((id) => {
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
                    value = FileUtils.ensureFileRepeatName('untitled_folder', targetFile?.parent?.allChildren);
                }
                file.name = value;
                console.log(`targetFile rename, old=${targetFile?.name} new=${value}`);
                await targetFile?.rename(value);
                // ! 更新file.path
                file.path = targetFile?.pathString || '';

                FinderUtils.refreshAllFinderDirInfo(); // 更新其他finder窗口的ui
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
window.useFinderStore = useFinderStore;

function mockFilesInfo () {
    let id = 0;
    return [
        {
            id: `${id++}`,
            name: 'looooooooooooooooog name test',
            isDir: true
        },
    ] as IFileInfo[];
}