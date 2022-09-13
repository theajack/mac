/*
 * @Author: tackchen
 * @Date: 2022-09-13 00:08:13
 * @Description: Coding something
 */

import Filer from 'filer.js';
import { Dir } from '../files/dir';

function onError (err: any): void {
    console.error(err);
}

export class DiskFiler {
    static instance: DiskFiler;
    filer: any;

    constructor ({
        persistent = false,
        size = 1024 * 1024
    }: {
        persistent?: boolean,
        size?: number,
    } = {}) {
        if (DiskFiler.instance) return DiskFiler.instance;
        this.filer = new Filer();

        this.filer.init({ persistent, size }, function (fs: any) {
            // filer.size == Filer.DEFAULT_FS_SIZE
            // filer.isOpen == true
            // filer.fs == fs
            console.log(fs);
        }, (e: any) => {
            console.error(e);
        });
        DiskFiler.instance = this;
    }

    initFiles (parent: Dir) {
        this._traverseDir({
            path: parent.path,
            parent,
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
        parent
    }: {
        name?: string;
        path: string;
        parent: Dir
    }) {
        this.filer.ls(path, (files: any[]) => {
            files.forEach(item => {
                const isDir = item.isDirectory;
                if (isDir) {
                    this._traverseDir({
                        name: item.name,
                        path: item.fullPath,
                        parent: parent.createDir({ name })
                    });
                } else {
                    parent.createFile({
                        name,
                        // todo content
                    });
                }
            });
        });
    }
}