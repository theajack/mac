/*
 * @Author: tackchen
 * @Date: 2022-09-11 00:01:27
 * @Description: Coding something
 */

import { Path } from 'webos-path';
import { timeId } from '../lib/utils';
import { fs } from '../saver/filer';
import type { Dir } from './dir';
import { FileUtils } from './file-utils';
import { getDisk } from '../disk';

export interface IFileBaseOption {
    name: string,
    entry?: any,
    path?: string,
    isSystemFile?: boolean,
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

export interface IFileEntry {
    fullPath: string;
    isDirectory: boolean;
    isFile: boolean;
    name: string;
}

export abstract class FileBase implements IFileBaseInfo {
    isDisk = false;
    id: string;
    name: string;
    type: 'file' | 'dir' | 'disk';
    isDir = false;
    path: Path;

    isSystemFile = false;

    entry: IFileEntry; // 第三方底层file对象，本项目中是filer中的entry

    parent: Dir | null;

    constructor ({
        name = '',
        entry = null,
        isSystemFile = false,
        path
    }: IFileBaseOption) {
        this.id = timeId();
        this.entry = entry;
        this.isSystemFile = isSystemFile;
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

        return fs().rm(this.pathString); // , this.isDir
    }

    pureRemove () {
        return fs().rm(this.pathString);
    }

    abstract getSize(): Promise<number>;
    abstract getType(): Promise<string>;
    get pathString () {
        return this.path.path;
    }

    async rename (name: string) {
        try {
            console.log(`rename path=${this.pathString} name=${name}`);
            await fs().rename(this.pathString, name);
            // 更新path
            this.path = this.path.rename(name);
        } catch (e) {
            console.error(e);
        }
        this.name = name;
    }

    async moveTo (targetDirPath: string, renameIfConflict = false, repeatMark = '.Move') {
        const dir = await getDisk().findDirByPath(targetDirPath);

        if (!dir) {
            throw new Error(`Could not find targer Dir: ${targetDirPath}`);
        }

        let name = this.name;
        if (!renameIfConflict) {
            name = FileUtils.ensureFileRepeatName(
                this.name,
                dir.children,
                repeatMark
            );
        } else {
            if (dir.children.find(file => file.name === name)) {
                throw new Error(`File already exists: ${name}`);
            }
        }

        const newEntry = await fs().mv(this.pathString, targetDirPath, name);

        // 修改name和path
        this.name = name;
        this.updateEntry(newEntry);

        // 调整children
        const children = this.parent?.children || [];
        children.splice(children.indexOf(this), 1);
        dir.addChild(this);

        return name;
    }

    async updateEntry (newEntry: IFileEntry) {
        this.path = new Path(newEntry.fullPath);
        this.setEntry(newEntry);
    }

    isHiddenFile () {
        return FileUtils.isHiddenFile(this.name);
    }
}