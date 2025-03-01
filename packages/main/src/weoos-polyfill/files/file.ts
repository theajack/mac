/*
 * @Author: tackchen
 * @Date: 2022-09-10 22:08:00
 * @Description: Coding something
 */

// import {createLocker} from '../utils';
import { decode, encode, getFileExt, getFileName, getParentPath } from '@/weoos-polyfill/temp/os';
import { useDisk } from '../disk';
import type { IFileBaseOption } from './base';
import { FileBase } from './base';
import type { Dir } from './dir';
import { getDisk } from '@/core/os/os';

export interface IFileOption extends IFileBaseOption {
    mimetype?: string;
}

export class File extends FileBase {

    constructor (options: IFileOption) {
        super(options);
        this.type = 'file';
    }

    async getSize () {
        return (await (await useDisk()).stat(this.path)).size / 1024;
    }
    async getType () {
        return (await (await useDisk()).stat(this.path)).type;
    }
    async readText (): Promise<string> {
        return (await (await useDisk()).readText(this.path)) || '';
    }

    async readRawString () {
        const u8s = await this.read();
        return decode(u8s);
    }

    // ! 读原始的Uint8Array
    async read (): Promise<Uint8Array> {
        return (await (await useDisk()).read(this.path)) || new Uint8Array(0);
    }

    // ! 写原始的Uint8Array
    async write (
        content: Uint8Array,
        append = false
    ) {
        const fn = append ? 'append' : 'write';
        return (await useDisk())[fn](this.path, content);
    }

    async writeText (
        content: string,
        append = false
    ) {
        return this.write(encode(content), append);
    }

    export () {

    }

    get ext () {
        return getFileExt(this.name);
    }

    // todo 测试嵌套文件夹
    async unzipTo (dir: Dir) {
        const disk = await useDisk();
        const result = await disk.unzip(this.path, dir.path);
        result.sort((a, b) => a.path > b.path ? 1 : -1);

        for (const { path, isDir } of result) {
            (await getDisk().findDirByPath(getParentPath(path)))!.createEntry(
                getFileName(path), isDir
            );
        }
        return result;
    }
}