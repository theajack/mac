/*
 * @Author: tackchen
 * @Date: 2022-09-12 22:45:10
 * @Description: Coding something
 */

import { DiskFiler } from './filer';

export function fs () {
    return DiskFiler.instance;
}

export function initFilerSaver () {
    new DiskFiler();

    return fs().initFiles();
}


(window as any)._fs = fs;