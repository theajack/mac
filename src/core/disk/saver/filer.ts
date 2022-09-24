/*
 * @Author: tackchen
 * @Date: 2022-09-13 00:08:13
 * @Description: Coding something
 */

import Filer from 'filer.js';
import { FileBase } from '../files/base';
import { Dir } from '../files/dir';

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
        console.trace(path);
        this.filer.create(path, true, function (fileEntry: any) {
            // fileEntry.name == 'myFile.txt'
            console.log(fileEntry);
        }, (err: any) => {
            console.error(err);
        });
    }

    mkdir (path: string) {
        this.filer.mkdir(path, true, function (fileEntry: any) {
            // fileEntry.name == 'myFile.txt'
            console.log(fileEntry);
        }, (err: any) => {
            console.error(err);
        });
    }

    private _traverseDir ({
        path,
        parent,
        onresult
    }: {
        path: string;
        parent: Dir;
        onresult?: (files: FileBase[])=>void;
    }) {
        // console.warn('travese');
        this.filer.ls(path, (files: any[]) => {
            // console.log('[ls] ', parent.path, path, files);

            const result: FileBase[] = [];

            let loadedNumber = 0;
            const checkLoaded = () => {
                loadedNumber ++;
                // console.warn('checkLoaded', path, loadedNumber, files.length);
                if (loadedNumber >= files.length) {
                    if (onresult) onresult(result);
                }
            };

            if (files.length === 0) {
                if (onresult) onresult(result);
            } else {
                files.forEach(item => {
                    // console.warn('---', path, item);
                    const { isDirectory, name } = item;
                    if (isDirectory) {
                        const dir = parent.createDir({ name }, true);
                        result.push(dir);
                        this._traverseDir({
                            path: item.fullPath,
                            parent: dir,
                            onresult: () => {
                                // console.warn('start check', path, loadedNumber, files.length);
                                checkLoaded();
                            }
                        });
                    } else {
                        result.push(parent.createFile({
                            name,
                            // todo content
                        }, true));
                        console.warn('start check', path, loadedNumber, files.length);
                        checkLoaded();
                    }
                });
            }

        });
    }
}