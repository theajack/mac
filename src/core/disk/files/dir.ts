/*
 * @Author: tackchen
 * @Date: 2022-09-11 00:01:22
 * @Description: Coding something
 */

import { fs } from '../saver/saver';
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

    addChild<T extends FileBase> (file: T): T {
        file.setParent(this);
        this.children.push(file);

        fs()[file.isDir ? 'mkdir' : 'createFile'](file.path);

        return file;
    }

    createFile (options: IFileOption) {
        return this.addChild(new File(options));
    }

    createDir (options: IDirOption) {
        return this.addChild(new Dir(options));
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
}