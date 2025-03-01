/*
 * @Author: tackchen
 * @Date: 2022-09-11 00:01:27
 * @Description: Coding something
 */

import { timeId } from '@/lib/utils';
import type { Dir } from './dir';
import { getFileName, pt } from '@/weoos-polyfill/temp/os';
import { DiskEvent } from '../disk-event';
import { useDisk } from '../disk';
import { FileUtils, isSystemPath } from '../utils';
import { getDisk } from '@/core/os/os';


export interface IFileBaseOption {
    name?: string,
    path?: string,
}

export interface IFileBaseInfo {
    id: string;
    name: string;
    isDir: boolean;
    path: string;
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
    path: string;

    get isSystemFile () {
        return isSystemPath(this.path);
    }

    parent: Dir | null;

    abstract getSize(): Promise<number>;
    abstract getType(): Promise<string>;

    constructor ({
        name = '',
        path
    }: IFileBaseOption) {
        this.id = timeId();
        if (!name) {
            name = getFileName(path!);
        }
        this.name = name;
        this.initConstructOptions({ path });
    }

    initConstructOptions ({
        path
    }: IFileBaseOption) {
        if (typeof path !== 'undefined') {
            this.path = path;
        }
        return this;
    }


    async remove () {
        if (!this.parent) return false;

        const result = await (await useDisk()).remove(this.pathString); // , this.isDir

        this.emitDirChange();

        this.parent?.removeEntry(this);

        return result;
    }

    get pathString () {
        return this.path;
    }

    async rename (name: string) {
        const oldName = this.name;
        const errInfo = await (await useDisk()).rename(
            this.pathString,
            name,
            (newPath) => {
                // 修改name和path
                this.name = getFileName(newPath);
                this.path = newPath;
            }
        );
        if (errInfo) {
            throw new Error(`Rename fail: ${errInfo}`);
        }
        if (this.isHiddenFile() !== this.isHiddenFile(oldName)) {
            this.parent?.removeEntry(this, oldName);
            this.parent?.addEntry(this);
        }
    }

    async moveTo ({
        targetDirPath,
        newName,
    }: {
        targetDirPath: string,
        newName?: string,
    }) {
        const oldName = this.name;
        const errInfo = await (await useDisk()).move(
            this.pathString,
            pt.join(targetDirPath, newName || this.name),
            (newPath) => {
                // 修改name和path
                this.name = getFileName(newPath);
                this.path = newPath;
            }
        );
        if (errInfo) {
            throw new Error(`Could not find targer Dir: ${errInfo}`);
        }

        this.emitDirChange();
        // 需要从children中删除，并增加到新数组中
        this.parent?.removeEntry(this, oldName);
        (await getDisk().findDirByPath(targetDirPath))?.addEntry(this);

        return this.name;
    }

    isHiddenFile (name = this.name) {
        return FileUtils.isHiddenFile(name);
    }

    emitDirChange () {
        // 触发目录变化事件
        if (this.parent && !this.isHiddenFile()) {
            DiskEvent.emit('disk-dir-change', [ this.parent.pathString ]);
        }
    }
}