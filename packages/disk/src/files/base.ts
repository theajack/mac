/*
 * @Author: tackchen
 * @Date: 2022-09-11 00:01:27
 * @Description: Coding something
 */

import { Path } from 'webos-path';
import { timeId } from '../lib/utils';
import { fs } from '../saver/filer';
import { Dir } from './dir';

export interface IFileBaseOption {
    name: string,
    entry?: any,
    path?: string,
}

export interface IFileBaseInfo {
    id: string;
    name: string;
    isDir: boolean;
    path: Path;
}

export interface IFileDisplayInfo extends IFileBaseInfo {
    size: number,
    type: string,
}


export abstract class FileBase implements IFileBaseInfo {
    isDisk = false;
    id: string;
    name: string;
    type: 'file' | 'dir' | 'disk';
    isDir = false;
    path: Path;

    entry: any; // 第三方底层file对象，本项目中是filer中的entry

    parent: Dir | null;

    constructor ({
        name = '',
        entry = null,
        path
    }: IFileBaseOption) {
        this.id = timeId();
        this.entry = entry;
        this.name = name;
        if (path) {
            this.path = new Path(path);
        }
    }


    setEntry (entry: any) {
        this.entry = entry;
    }

    setParent (parent: Dir | null) {
        this.parent = parent;
        if (parent && !this.path) {
            this.path = parent.path.join(this.name);
            // console.warn(this.path.path);
        }
    }

    async remove () {
        if (!this.parent) return false;

        const list = this.parent.children;

        const index = list.findIndex(child => child === this);

        if (index === -1) {
            console.warn('文件未找到');
            return false;
        }

        list.splice(index, 1);

        return fs().rm(this.path.path); // , this.isDir
    }

    abstract getSize(): Promise<number>;
    abstract getType(): Promise<string>;
    get pathString () {
        return this.path.path;
    }
}