/*
 * @Author: tackchen
 * @Date: 2022-09-13 00:08:13
 * @Description: Coding something
 */

import { createLoadedChecker } from '@/lib/create';
import { log } from '@/lib/utils';
import { promiseify } from '../saver/promiseify-map';
import Filer from 'filer.js';
import { FileBase } from '../files/base';
import { Dir } from '../files/dir';
import { FilerReader } from './reader';

export class DiskFiler {
    static instance: DiskFiler;
    filer: any;

    reader: FilerReader;

    constructor ({
        persistent = false,
        size = 1024 * 1024,
        onready,
    }: {
        persistent?: boolean,
        size?: number,
        onready?: ()=>void
    } = {}) {
        if (DiskFiler.instance) return DiskFiler.instance;
        this.filer = new Filer();
        this.reader = new FilerReader(this.filer);
        (window as any).filer = this.filer;

        this.filer.init({ persistent, size }, function (fs: any) {
            // filer.size == Filer.DEFAULT_FS_SIZE
            // filer.isOpen == true
            // filer.fs == fs
            console.log(fs);
            if (onready) onready();
        }, (e: any) => {
            console.error(e);
        });
        DiskFiler.instance = this;
    }

    async initFiles (parent: Dir) {
        return new Promise<FileBase[]>((resolve) => {
            this._traverseDir({
                path: parent.path || '/',
                parent,
            }, (files) => {
                resolve(files);
            });
        });
    }

    createFile (path: string) {
        return promiseify(this.filer.create)(path, true);
    }

    mkdir (path: string) {
        return new Promise((resolve, reject) => {
            const index = path.lastIndexOf('/');
            const dir = path.substring(0, index) || '/';
            const name = path.substring(index + 1);
            // ! 先进入父目录再mkdir，直接根据绝对路径mkdir无法拿到success回调
            this.cd(dir).then(() => {
                this.filer.mkdir((name), true, () => {
                    resolve(true);
                }, () => {
                    reject();
                });
            });

        });
        // return promiseify(this.filer.mkdir)(path, true);
    }

    cd (path: string) {
        return promiseify(this.filer.cd)(path);
    }

    rm (path: string, isDir: boolean) {
        log('warn', 'rm ' + path, isDir);
        return promiseify(this.filer.rm.bind(this.filer))(path);
    }

    private async _traverseDir ({
        path,
        parent,
    }: {
        path: string;
        parent: Dir;
    }, onsuccess?: (files: FileBase[])=>void) {
        log('travese', path);

        const files = await promiseify<any[]>(this.filer.ls)(path);
        const result: FileBase[] = [];

        const check = createLoadedChecker(files.length, () => {
            if (onsuccess) onsuccess(result);
        });

        if (files.length === 0) {
            if (onsuccess) onsuccess(result);
            return;
        }

        files.forEach(async entry => {
            console.warn('---', path, entry);
            const { isDirectory, name } = entry;
            if (isDirectory) {
                const dir = await parent.createDir({ name, entry }, { fromInit: true });
                if (!dir) {
                    check();
                    return;
                }
                result.push(dir);
                this._traverseDir({
                    path: entry.fullPath,
                    parent: dir,
                }, check);
            } else {
                const file = await parent.createFile({
                    name,
                    entry,
                    // todo content
                }, { fromInit: true });
                if (!file) {
                    check();
                    return;
                }
                result.push(file);
                check();
            }
        });

    }
}