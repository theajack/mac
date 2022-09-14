/*
 * @Author: tackchen
 * @Date: 2022-09-12 22:45:10
 * @Description: Coding something
 */

import { Disk } from '../disk';
import { FileBase } from '../files/base';
import { DiskFiler } from './filer';

export function fs () {
    return DiskFiler.instance;
}

export function initFilerSaver (disk: Disk) {
    return new Promise<FileBase[]>((resolve) => {
        new DiskFiler({
            onready () {
                fs().initFiles(disk).then(files => {
                    resolve(files);
                });
            }
        });
    });

}


(window as any)._fs = fs;