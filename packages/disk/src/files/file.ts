/*
 * @Author: tackchen
 * @Date: 2022-09-10 22:08:00
 * @Description: Coding something
 */

import { readFileBinary, u8sToString } from '../lib/utils';
import { fs } from '../saver/filer';
import type { IFileBaseOption } from './base';
import { FileBase } from './base';
import { fileParser } from './file-parser';
import { createLocker } from '../lib/create';
import { FileUtils } from './file-utils';
import { ZipUtils } from '../lib/zip';
import type { Dir } from './dir';
import { Path } from 'webos-path';
import { NameConflictChoose } from '../constant';

export interface IFileOption extends IFileBaseOption {
    mimetype?: string;
}

export class File extends FileBase {

    private _file: NFile|null = null;
    private _locker = createLocker();
    async getFile () {
        await this._locker.waitUnlock();
        if (!this._file) {
            this._file = await (fs().getNativeFile(this.path.path));
        }
        return this._file;
    }

    constructor (options: IFileOption) {
        super(options);
        this.type = 'file';
    }

    async getSize () {
        const size = (await this.getFile()).size / 1024;
        return size;
    }
    async getType () {
        return (await this.getFile()).type;
    }
    async readWithParser<T = any> (): Promise<T> {
        return fileParser.read(
            await this.read(),
            this.name,
            await this.getType(),
        );
    }
    async readText (): Promise<string> {
        return fileParser.readText(await this.read());
    }

    async readRawString () {
        const u8s = await this.read();
        return u8sToString(u8s);
    }

    // ! 读原始的Uint8Array
    async read (): Promise<Uint8Array> {
        return readFileBinary(await this.getFile());
    }

    async writeWithParser (
        content: Uint8Array,
        append = false
    ) {
        const u8s = await fileParser.write(
            content,
            this.name,
            await this.getType(),
        );
        return this.write(u8s, append);
    }

    // ! 写原始的Uint8Array
    async write (
        content: Uint8Array,
        append = false
    ) {
        try {
            this._locker.lock();
            await fs().write({
                path: this.path.path,
                content,
                append,
            });
            this._file = null; // ! 清空
            this._locker.unlock();
            return true;
        } catch (e) {
            console.warn('Read Fail: ', e);
            this._locker.unlock();
            return false;
        }
    }

    async writeText (
        content: string,
        append = false
    ) {
        return this.write(
            await fileParser.writeText(content),
            append,
        );
    }
    initFile (data: Uint8Array, fileName: string, type = '') {
        const blob = new Blob([ data ], { type });
        this._file = new window.File([ blob ], fileName);
    }

    async copy (): Promise<File> {
        const data = await this.read();
        const file = new File({
            name: this.name,
        });
        const nfile = await this.getFile();
        file.initFile(data, nfile.name, nfile.type);
        return file;
    }


    export () {

    }

    get ext () {
        return FileUtils.splitLastStr(this.name, '.')[1];
    }

    get isZip () {
        return this.ext === 'zip';
    }

    async unzipTo (dir: Dir) {
        if (!this.isZip) return;
        const targetPath = dir.pathString;
        const files = await ZipUtils.unzip(this);

        const dirNames = new Set([] as string[]);

        for (const file of files) {
            const filePath = Path.trim(file.path);
            // [相对路径, 名称]
            const firstName = filePath.split('/')[0];

            const isRootFile = filePath === firstName;

            console.warn(`unzipTo: targetPath=${targetPath}, firstName=${firstName}`);
            if (file.isDir || !isRootFile) {
            // 处理命名冲突
                if (!dirNames.has(firstName)) {
                    await dir.ensureDirByPath(Path.join(targetPath, firstName), NameConflictChoose.Rename);
                    dirNames.add(firstName);
                }
            }
            if (file.isDir) {
                await dir.ensureDirByPath(Path.join(targetPath, filePath));
            } else {
                // 释放解压文件
                const targetFile = await dir.ensureFileByPath(Path.join(targetPath, filePath));
                await targetFile.write(file.data);
            }
        }

    }
}