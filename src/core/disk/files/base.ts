/*
 * @Author: tackchen
 * @Date: 2022-09-11 00:01:27
 * @Description: Coding something
 */

import { timeId } from '@/lib/utils';
import { fs } from '../saver/saver';
import { Dir } from './dir';

export interface IFileBaseOption {
    name: string,
}

export abstract class FileBase {
    id: string;
    name: string;
    type: 'file' | 'dir' | 'disk';
    isDir = false;
    path: string;

    _size = -1; // 当_size 为 -1 时，会重新计算 size
    get size () {
        if (this._size < 0) {
            this._size = this.countSize();
        }
        return this._size;
    }

    parent: Dir | null;

    constructor ({
        name = '',
    }: IFileBaseOption) {
        this.id = timeId();
        this.name = name;
    }

    setParent (parent: Dir | null) {
        this.parent = parent;
        if (parent) {
            this.path = parent.path + '/' + this.name;
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

        this.markParentClearSize();

        return fs().rm(this.path, this.isDir);
    }

    private markParentClearSize () {
        let parent = this.parent;

        while (parent) {
            parent._size = -1;
            parent = parent.parent;
        }
    }

    abstract copy(): FileBase;

    abstract countSize(): number;
}