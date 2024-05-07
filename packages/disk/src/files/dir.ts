/*
 * @Author: tackchen
 * @Date: 2022-09-11 00:01:22
 * @Description: Coding something
 */

import type { IJson } from '../type.d';
import { log } from '../lib/utils';
import { fs } from '../saver/filer';
import type { IFileDisplayInfo, IFileBaseOption, IFileEntry } from './base';
import { FileBase } from './base';
import type { IFileOption } from './file';
import { File } from './file';
import { Disk } from '../disk';
import { Path } from 'webos-path';
import { FileUtils } from './file-utils';
import { NameConflictChoose } from '../constant';
import { ZipUtils } from '../lib/zip';

export interface IDirOption extends IFileBaseOption {
    children?: FileBase[];
    hiddenChildren?: FileBase[];
}

export interface ICreateConfig {
    conflictChoose?: NameConflictChoose;
}

interface IFileContentOptions extends IFileOption {
    content?: Uint8Array;
}

export class Dir extends FileBase {
    children: FileBase[] = [];
    hiddenChildren: FileBase[] = [];
    constructor (options: IDirOption) {
        super(options);
        this.type = 'dir';
        this.isDir = true;
        this.initChildren(options.children || [], options.hiddenChildren || []);
    }

    initChildren (children: FileBase[], hiddenChildren: FileBase[] = []) {
        this.children = children;
        this.hiddenChildren = hiddenChildren;
        children.forEach(item => {
            item.setParent(this);
        });
        hiddenChildren.forEach(item => {
            item.setParent(this);
        });
    }

    async getSize (): Promise<number> {
        let size = 0;
        await Promise.all(this.children.map(async child => {
            size += await child.getSize();
        }));
        return size;
    }

    async getType () {
        return 'directory';
    }

    async addChild<T extends FileBase> (file: T): Promise<T> {

        const isHidden = file.isHiddenFile();

        const children = isHidden ? this.hiddenChildren : this.children;

        children.push(file);

        file.setParent(this);

        if (!file.entry) {
            const filePath = file.path.path;
            // console.log(filePath);
            const entry = await fs()[file.isDir ? 'mkdir' : 'createFile'](filePath);
            file.setEntry(entry);
        }

        return file;
    }

    async ensureDirByPath (
        path: string,
        conflictChoose = NameConflictChoose.Return
    ): Promise<Dir> {
        // @ts-ignore
        return this.createChildByPath(path, true, conflictChoose);
    }
    async ensureFileByPath (
        path: string,
        conflictChoose = NameConflictChoose.Return
    ): Promise<File> {
        // @ts-ignore
        return this.createChildByPath(path, false, conflictChoose);
    }

    async createChildByPath<T extends Dir|File = Dir> (
        path: string,
        isDir: boolean,
        conflictChoose = NameConflictChoose.Null,
    ): Promise<T|null> {
        if (path === '/') return Disk.instance as any;
        let absolutePath = Path.join(this.pathString, path);
        let parent: Dir;
        if (absolutePath.startsWith(this.pathString)) {
            parent = this;
            absolutePath = absolutePath.substring(this.pathString.length);
        } else {
            parent = Disk.instance;
        }
        absolutePath = Path.trim(absolutePath);
        const dirs = absolutePath.split('/');
        while (dirs.length > 1) {
            const curDir = dirs.shift()!;
            parent = await parent.ensureDir({ name: curDir });
        }
        const name = dirs.shift()!;
        return parent[isDir ? 'createDir' : 'createFile']({ name }, { conflictChoose }) as Promise<T|null>;
    }

    ensureDir (
        options: IDirOption,
        conflictChoose: NameConflictChoose = NameConflictChoose.Return
    ): Promise<Dir> {
        // @ts-ignore
        return this.createDir(options, { conflictChoose });
    }

    async createDir (options: IDirOption, config: ICreateConfig = {}): Promise<null | Dir> {
        // console.log('createDir', options, this, this.entry);
        log('createDir', options.name, config.conflictChoose);
        if (this.exists(options.name)) {
            switch (config.conflictChoose) {
                case NameConflictChoose.Return: {
                    return (await this.findDirByPath(options.name))!.initConstructOptions(options);
                }
                case NameConflictChoose.Rename: {
                    options.name = FileUtils.ensureFileRepeatName(options.name, this.allChildren);
                }
                default: {
                    log('warn', '目录已经存在', `${this.path.path}/${options.name}`);
                    return null;
                }
            }
        }
        return this.addChild(new Dir(options));
    }
    ensureFile (
        options: IFileContentOptions,
        conflictChoose: NameConflictChoose = NameConflictChoose.Return
    ): Promise<File> {
        // @ts-ignore
        return this.createFile(options, { conflictChoose });
    }
    async createFile (options: IFileContentOptions, config: ICreateConfig = {}): Promise<File | null> {
        // console.log('createFile', options, this, this.entry);
        log('create file', options.name);
        if (this.exists(options.name)) {
            switch (config.conflictChoose) {
                case NameConflictChoose.Return: {
                    return (await this.findFileByPath(options.name))!.initConstructOptions(options);
                }
                case NameConflictChoose.Rename: {
                    options.name = FileUtils.ensureFileRepeatName(options.name, this.allChildren);
                }
                default: {
                    log('warn', '文件已存在');
                    return null;
                }
            }
        }
        const file = await this.addChild(new File(options));
        // 先 addChild，add 会在 FileSystem 中创建文件
        if (options.content) {
            await file.write(options.content);
        }
        return file;
    }

    exists (name: string) {
        return !!this.findChild(name) ||
            !!this.findChild(name, true);
    }

    async paste (file: FileBase) {
        const name = FileUtils.ensureFileRepeatName(file.name, this.allChildren, '_Copy');
        const entry = await fs().cp(file.pathString, this.pathString, name);
        const value = new (file.isDir ? Dir : File)({ name, entry });
        await this.addChild(value);
        if (file.isDir) {
            fs().initFiles(value as Dir);
        }
        return value;
    }

    get allChildren () {
        return [ ...this.children, ...this.hiddenChildren ];
    }

    async findChildByPath (
        pathValue: string | string[],
    ): Promise<Dir | File | null> {
        const path = Path.from(pathValue);
        if (path.isRoot) {
            return Disk.instance.findChildByPath(path.relative);
        }
        // ! 当文件没有实际创建好时 等待初始化完成再返回
        // if (!this.entry) await this.onloaded();
        if (path.array.length === 0) return this;
        const name = path.array.shift() || '';
        if (name === Path.Back) {
            return (this.parent || this).findChildByPath(path.array);
        }
        const file = this.findChild(name) || this.findChild(name, true);
        if (!file) return null;
        if (file.isDir) return (file as any as Dir).findChildByPath(path.array);
        return file as File;
    }

    private findChild (name: string, hidden = false) {
        return (hidden ? this.hiddenChildren : this.children).find(file => file.name === name);
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

    async findFileByPath (
        path: string | string[],
    ): Promise<File | null> {
        const child = await this.findChildByPath(path);
        if (!child || child.isDir) {
            console.warn('目标不存在 或是一个文件夹而不是文件');
            return null;
        }
        return child as File;
    }

    async findDirByPath (
        path: string | string[],
    ): Promise<Dir | null> {
        const child = await this.findChildByPath(path);
        if (!child?.isDir) {
            console.warn('目标不存在 或是一个文件而不是文件夹');
            return null;
        }
        return child as Dir;
    }

    ls () {
        return this.children.map(file => file.name);
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
        await Promise.all(this.children.map(async file => {
            await file.pureRemove();
        }));
        this.children = [];
    }

    async updateEntry (newEntry: IFileEntry) {
        await super.updateEntry(newEntry);

        if (this.children.length === 0) return;

        const entries = await fs().ls(newEntry.fullPath);

        for (const file of this.children) {
            const index = entries.findIndex(entry => entry.name === file.name);
            if (index === -1) {
                throw new Error(`Target not exist`);
            }
            const entry = entries.splice(index, 1)[0];
            file.updateEntry(entry);
        }

    }

    async zipFiles (files: FileBase[], filename?: string) {
        if (!files.length) return;

        if (!filename) {
            filename = files.length === 1 ? `${files[0].name}.zip` : 'Archive.zip';
        }

        // 压缩包文件名
        filename = FileUtils.ensureFileRepeatName(filename, this.allChildren);
        const content = await ZipUtils.zip(files);
        await this.createFile({ name: filename, content });
    }
}