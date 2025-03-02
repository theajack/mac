/*
 * @Author: tackchen
 * @Date: 2022-09-11 00:01:22
 * @Description: Coding something
 */

import { createPromises, getFileName, pt } from '@/weoos-polyfill/temp/os';
import { useDisk } from '../disk-provider';
import { FileBase } from './base';
import type { IFileBaseOption, IFileDisplayInfo } from './base';
import { File, type IFileOption } from './file';
import type { IJson } from '@/core/type';
import { FileUtils } from '../utils';
import { getDisk } from '@/core/os/os';
import { toastText } from '@/ui/components/common/toast/toast';

export type IDirOption = IFileBaseOption

// export interface ICreateConfig {
//     conflictChoose?: NameConflictChoose;
// }

interface IFileContentOptions extends IFileOption {
    content?: Uint8Array;
}

export class Dir extends FileBase {
    get isRoot () {
        return this.path === '/';
    }
    children: FileBase[] = [];
    hiddenChildren: FileBase[] = [];
    get allChildren () {
        return [ ...this.children, ...this.hiddenChildren ];
    }
    constructor (options: IDirOption) {
        super(options);
        this.type = 'dir';
        this.isDir = true;
    }

    async initChildren () {
        const names = await useDisk().ls(this.path);

        if (!names) return;

        const { add, run } = createPromises();
        for (const name of names) {
            add(this.initSyncChildren(name));
        }
        await run();
    }

    private async initSyncChildren (name: string) {
        const path = pt.join(this.path, name);
        const type = await useDisk().getType(path);
        const isDir = type === 'dir';
        const target = this.createEntry(name, isDir);
        if (isDir) {
            await (target as Dir).initChildren();
        }
    }

    async lsDetail (): Promise<IFileDisplayInfo[]> {
        return Promise.all(this.children.map(async file => ({
            name: file.name,
            isDir: file.isDir,
            size: await file.getSize(),
            path: file.path,
            id: file.id,
            type: await file.getType(),
        })));
    }
    async getType () {
        return 'directory';
    }

    async getSize () {
        let size = 0;
        await Promise.all(this.children.map(async (file) => {
            size += await file.getSize();
        }));
        return size;
    }

    async ensureDir (
        options: IDirOption,
    ): Promise<Dir> {
        return this.createDir(options, true);
    }
    async createDir (options: IDirOption, ensure = false): Promise<Dir> {
        const path = options.path || pt.join(this.path, options.name!);
        const disk = useDisk();
        if (await disk.exist(path)) {
            return (await this.findDirByPath(path))!;
        }
        await disk.createDir(path, { ensure });
        return this.createEntry(getFileName(path), true);
    }
    async ensureFile (
        options: IFileContentOptions,
    ): Promise<File> {
        return this.createFile(options, true);
    }
    async createFile (options: IFileContentOptions, ensure = false): Promise<File> {
        const path = options.path || pt.join(this.path, options.name!);
        const disk = useDisk();
        if (await disk.exist(path)) {
            return (await this.findFileByPath(path))!;
        }
        await disk.createFile(path, undefined, { ensure });
        return this.createEntry(getFileName(path), false);
    }
    getChildren (name: string) {
        return FileUtils.isHiddenFile(name) ? this.hiddenChildren : this.children;
    }
    createEntry<T extends boolean> (name: string, isDir: T, emitChange = true): T extends true ? Dir: File {
        const entry = new (isDir ? Dir : File)({ name, path: pt.join(this.path, name) });
        this.getChildren(name).push(entry);
        entry.parent = this;
        debugger;
        if (emitChange) this.emitDirChange();
        // @ts-ignore
        return entry;
    }

    filerChild (query: string, deep = true) {
        const result: FileBase[] = [];

        const children = this.children;

        const n = children.length;
        for (let i = 0; i < n; i++) {
            const child = children[i];
            if (child.name.indexOf(query) !== -1) {
                result.push(child);
            }
            if (deep && child.isDir) {
                result.push(...(child as any as Dir).filerChild(query, deep));
            }
        }
        return result;
    }

    ls () {
        return this.children.map(file => file.name);
    }

    deepLs () {
        const result: IJson = {};
        this.children.forEach(file => {
            if (file.isDir) {
                result[file.name] = (file as Dir).deepLs();
            } else {
                result[file.name] = file.name;
            }
        });
        return result;
    }

    importDir () {

    }

    importFile () {

    }

    // 将当前文件夹导出为zip包
    export () {

    }

    get isEmpty () {
        return this.children.length === 0;
    }

    async clearDir () {
        const disk = useDisk();
        await disk.remove(this.path);
        await disk.createDir(this.path);
        this.children = this.hiddenChildren = [];
        this.emitDirChange();
    }

    async zipFiles (files: FileBase[], filename?: string) {
        if (!files.length) return;
        if (!filename) {
            filename = files.length === 1 ? `${files[0].name}.zip` : 'Archive.zip';
        }
        const disk = useDisk();
        const { success, info } = await disk.zip(files.map(file => file.path), filename);

        if (!success) {
            toastText(`zip fail: ${info}`);
            return;
        }
        this.createEntry(getFileName(info), false);
    }

    async findChildByPath (path: string): Promise<FileBase|null> {

        if (path[0] === '/' && !this.isRoot) return getDisk().findChildByPath(path);

        const paths = path.split('/');
        if (paths[0] === '') paths.shift(); // 排除根目录
        const name = paths.shift();

        const target = this.allChildren.find(item => item.name === name);
        if (!target) return null;
        if (paths.length === 0) return target;
        if (target.isDir) {
            return (target as Dir).findChildByPath(paths.join('/'));
        }
        return null;
    }
    async findFileByPath (path: string) {
        const target = await this.findChildByPath(path);
        if (!target) return null;
        return target.isDir ? null : target as File;
    }
    async findDirByPath (path: string) {
        if (path === '/' || !path) return getDisk();
        const target = await this.findChildByPath(path);
        if (!target) return null;
        return target.isDir ? target as Dir : null;
    }

    removeEntry (entry: FileBase, name = entry.name) {
        entry.parent = null;
        const list = this.getChildren(name);
        const index = list.findIndex(item => item == entry);
        if (index === -1) return;
        list.splice(index, 1);
    }

    addEntry (entry: FileBase) {
        const list = this.getChildren(entry.name);
        if (list.includes(entry)) return;
        entry.parent = this;
        list.push(entry);
    }
}