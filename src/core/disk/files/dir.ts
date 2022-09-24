/*
 * @Author: tackchen
 * @Date: 2022-09-11 00:01:22
 * @Description: Coding something
 */

import { IJson } from '@/core/type';
import { fs } from '../saver/saver';
import { trimPath } from '../utils';
import { FileBase, IFileBaseOption } from './base';
import { File, IFileOption } from './file';

export interface IDirOption extends IFileBaseOption {
    children?: FileBase[];
}

export class Dir extends FileBase {
    children: FileBase[] = [];
    constructor ({
        name,
        children = [],
    }: IDirOption) {
        super({ name });
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

    addChild<T extends FileBase> (file: T, fromInit = false): T {
        file.setParent(this);
        this.children.push(file);

        if (!fromInit)
            fs()[file.isDir ? 'mkdir' : 'createFile'](file.path);

        return file;
    }

    createFile (options: IFileOption, fromInit = false) {
        return this.addChild(new File(options), fromInit);
    }

    createDir (options: IDirOption, fromInit = false) {
        return this.addChild(new Dir(options), fromInit);
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