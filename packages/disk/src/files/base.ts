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
import { DiskEvent } from '../lib/disk-event';

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
        this.name = name;
        this.initConstructOptions({ path, entry, isSystemFile, name });
    }

    initConstructOptions ({
        entry,
        isSystemFile,
        path
    }: IFileBaseOption) {
        if (typeof path !== 'undefined') {
            this.path = new Path(path);
        }
        if (typeof isSystemFile !== 'undefined') {
            this.isSystemFile = isSystemFile;
        }
        if (typeof entry !== 'undefined') {
            this.entry = entry;
        }
        return this;
    }

    setEntry (entry: any) {
        this.entry = entry;
    }

    setParent (parent: Dir | null) {
        this.parent = parent;
        if (parent) {
            if (!this.path) {
                this.path = parent.path.join(this.name);
            }
            if (!this.isHiddenFile()) {
                DiskEvent.emit('disk-dir-change', [ parent.pathString ]);
            }
        }
    }

    async remove () {
        if (!this.parent) return false;

        const { children, index } = this.findParentChildInfo();

        if (index === -1) {
            console.warn('文件未找到');
            return false;
        }

        const result = await fs().rm(this.pathString); // , this.isDir
        children.splice(index, 1);

        if (!this.isHiddenFile()) {
            DiskEvent.emit('disk-dir-change', [ this.parent.pathString ]);
        }

        return result;
    }

    protected findParentChildInfo (): {
        children: FileBase[],
        index: number,
        } {
        if (!this.parent) {
            return { index: -1, children: [] };
        }
        let list = this.parent.children;
        let index = list.findIndex(child => child === this);
        if (index === -1) {
            list = this.parent.hiddenChildren;
            index = list.findIndex(child => child === this);
        }
        if (index === -1) {
            list = [];
        }
        return { children: list, index };
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

    async moveTo ({
        targetDirPath,
        renameIfConflict = false,
        repeatMark = '.Move',
        newName,
    }: {
        targetDirPath: string,
        renameIfConflict?: boolean,
        newName?: string,
        repeatMark?: string
    }) {
        const dir = await getDisk().findDirByPath(targetDirPath);

        if (!dir) {
            throw new Error(`Could not find targer Dir: ${targetDirPath}`);
        }

        let name = newName || this.name;
        if (renameIfConflict) {
            name = FileUtils.ensureFileRepeatName(
                name,
                dir.allChildren,
                repeatMark
            );
        } else {
            if (dir.allChildren.find(file => file.name === name)) {
                throw new Error(`File already exists: ${name}`);
            }
        }

        const newEntry = await fs().mv(this.pathString, targetDirPath, name);

        // 修改name和path
        this.name = name;
        this.updateEntry(newEntry);

        const { children, index } = this.findParentChildInfo();
        // 调整children
        children.splice(index, 1);
        dir.addChild(this);

        if (!this.isHiddenFile()) {
            DiskEvent.emit('disk-dir-change', [ this.parent!.pathString ]);
        }

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