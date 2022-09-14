/*
 * @Author: tackchen
 * @Date: 2022-09-13 00:08:13
 * @Description: Coding something
 */

import Filer from 'filer.js';
import { FileBase } from '../files/base';
import { Dir } from '../files/dir';

function onError (err: any): void {
    console.error(err);
}

export class DiskFiler {
    static instance: DiskFiler;
    filer: any;

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
                path: parent.path,
                parent,
                onresult (files) {
                    resolve(files);
                }
            });
        });
    }

    createFile (path: string) {
        this.filer.create(path, true, function (fileEntry: any) {
            // fileEntry.name == 'myFile.txt'
            console.log(fileEntry);
        }, onError);
    }

    mkdir (path: string) {
        this.filer.mkdir(path, true, function (fileEntry: any) {
            // fileEntry.name == 'myFile.txt'
            console.log(fileEntry);
        }, onError);
    }

    private _traverseDir ({
        name = '',
        path,
        parent,
        onresult
    }: {
        name?: string;
        path: string;
        parent: Dir;
        onresult?: (files: FileBase[])=>void;
    }) {
        this.filer.ls(path, (files: any[]) => {
            const result = files.map(item => {
                const isDir = item.isDirectory;
                if (isDir) {
                    const dir = parent.createDir({ name });
                    this._traverseDir({
                        name: item.name,
                        path: item.fullPath,
                        parent: dir
                    });
                    return dir;
                } else {
                    return parent.createFile({
                        name,
                        // todo content
                    });
                }
            });
            if (onresult) onresult(result);
        });
    }
}