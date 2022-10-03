/*
 * @Author: tackchen
 * @Date: 2022-09-11 00:01:22
 * @Description: Coding something
 */

import { IJson } from '@/core/type';
import { log } from '@/lib/utils';
import { fs } from '../saver/saver';
import { trimPath } from '../utils';
import { FileBase, IFileBaseOption } from './base';
import { File, IFileOption } from './file';

export interface IDirOption extends IFileBaseOption {
    children?: FileBase[];
}

export interface ICreateConfig {
    returnIfExists?: boolean;
    fromInit?: boolean;
}

export class Dir extends FileBase {
    children: FileBase[] = [];
    constructor ({
        name,
        children = [],
        entry,
    }: IDirOption) {
        super({ name, entry });
        this.type = 'dir';
        this.isDir = true;
        this.children = children;
    }

    countSize () {
        let size = 0;
        this.children.forEach(child => {
            size += child.countSize();
        });
        return size;
    }

    async addChild<T extends FileBase> (file: T, fromInit = false): Promise<T> {
        file.setParent(this);
        this.children.push(file);

        if (!fromInit) { // 初始化的时候是从fs里面拿的 所以不需要重复创建
            const entry = await fs()[file.isDir ? 'mkdir' : 'createFile'](file.path);
            this.setEntry(entry);
            if (!file.isDir) {
                await (file as any as File).write();
            }
        }

        return file;
    }

    async createFile (options: IFileOption, {
        returnIfExists,
        fromInit,
    }: ICreateConfig = {
        returnIfExists: false,
        fromInit: false,
    }) {
        log('create file', options.name);
        if (this.exists(options.name)) {
            if (returnIfExists) {
                const file = this.findFileByPath(options.name);
                if (file && !file.isDir) return file as File;
            }
            log('warn', '文件已存在');
            return null;
        }
        const file = await this.addChild(new File(options), fromInit);

        if (fromInit) {
            await file.read({ refresh: true });
        }
        return file;
    }

    createDir (options: IDirOption, {
        returnIfExists,
        fromInit,
    }: ICreateConfig = {
        returnIfExists: false,
        fromInit: false,
    }) {
        log('create dir', options.name);
        if (this.exists(options.name)) {
            if (returnIfExists) {
                const dir = this.findFileByPath(options.name);
                if (dir && dir.isDir) return dir as Dir;
            }
            log('warn', '目录已经存在');
            return null;
        }
        return this.addChild(new Dir(options), fromInit);
    }

    exists (name: string) {
        return !!this.children.find(item => item.name === name);
    }

    copy (): FileBase {
        const children = this.children.map(child => child.copy());
        return new Dir({
            name: this.name,
            children,
        });
    }

    paste (file: FileBase) {
        this.children.push(file);
    }

    findFileByPath (path: string | string[]): FileBase | null {
        const pathArray = typeof path === 'string' ? trimPath(path).split('/') : path;
        if (pathArray.length === 0) return this;
        const name = pathArray.shift();
        const file = this.children.find(file => file.name === name);
        if (!file) return null;
        if (file.isDir) return (file as Dir).findFileByPath(pathArray);
        return file;
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
}