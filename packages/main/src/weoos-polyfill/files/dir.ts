/*
 * @Author: tackchen
 * @Date: 2022-09-11 00:01:22
 * @Description: Coding something
 */

import { getFileName, pt } from '@/weoos-polyfill/temp/os';
import { useDisk } from '../disk';
import { FileBase } from './base';
import type { IFileBaseOption, IFileDisplayInfo } from './base';
import { File, type IFileOption } from './file';
import type { IJson } from '@/core/type';

export type IDirOption = IFileBaseOption

// export interface ICreateConfig {
//     conflictChoose?: NameConflictChoose;
// }

interface IFileContentOptions extends IFileOption {
    content?: Uint8Array;
}

export class Dir extends FileBase {

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

    initChildren () {

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
        (await useDisk()).createDir(path, { ensure });
        return new Dir({ name: getFileName(path), path });
    }
    async ensureFile (
        options: IFileContentOptions,
    ): Promise<File> {
        return this.createFile(options, true);
    }
    async createFile (options: IFileContentOptions, ensure = false): Promise<File> {
        const path = options.path || pt.join(this.path, options.name!);
        (await useDisk()).createFile(path, undefined, { ensure });
        return new File({ name: getFileName(path), path });
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
        const disk = await useDisk();
        await disk.remove(this.path);
        await disk.createDir(this.path);
    }

    async zipFiles (files: FileBase[], filename?: string) {
        if (!files.length) return;

        if (!filename) {
            filename = files.length === 1 ? `${files[0].name}.zip` : 'Archive.zip';
        }

        const disk = await useDisk();

        disk.zip(files.map(file => file.path), filename);
    }
}