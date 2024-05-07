/*
 * @Author: chenzhongsheng
 * @Date: 2024-05-06 16:57:06
 * @Description: Coding something
 */

import {  getOS } from '@/core/os/os';
import type { Dir } from 'webos-term';
import { type FileBase, FileUtils } from 'webos-term';
import { nextTick } from 'vue';
import { selectTextInput } from 'webos-utils';
import { StringText } from '@/core/string';
import { useFinderStore } from './finder-store';
import type { IFileInfo } from './finder-store';
import { resource } from '@/lib/utils';

const FileImageSet = new Set([ 'zip' ]);

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
        const name = FileUtils.ensureFileRepeatName(`Untitled${isDir ? '_folder' : ''}`, dir.allChildren);
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

    async refreshAllFinderDirInfo (affectPaths?: string[]) {
        const stores = useFinderStore.all();
        const curStore = this.getStore();
        for (const store of stores) {
            if (store === curStore) continue;
            if (!affectPaths || affectPaths.includes(store.getCurPath())) {
                store.refreshDirInfo();
            }
        }
    },

    chooseFileImage (file: IFileInfo) {
        const wrap = (name: string) => resource(`finder/${name}.png`);
        if (file.isDir) return wrap('folder');
        const [ _, ext ] = FileUtils.splitLastStr(file.name, '.');
        if (FileImageSet.has(ext)) {
            return wrap(ext);
        }
        return wrap('file');
    }
};