/*
 * @Author: chenzhongsheng
 * @Date: 2025-03-02 18:28:06
 * @Description: Coding something
 */
import { Disk } from './temp/dist';

export interface IDiskProvider {
    clear: Disk['clear'],
    remove: Disk['remove'],
    rename: Disk['rename'],
    move: Disk['move'],
    ls: Disk['ls'],
    getType: Disk['getType'],
    exist: Disk['exist'],
    createDir: Disk['createDir'],
    createFile: Disk['createFile'],
    zip: Disk['zip'],
    unzip: Disk['unzip'],
    stat: Disk['stat'],
    readText: Disk['readText'],
    read: Disk['read'],
    write: Disk['write'],
    append: Disk['append'],
    copy: Disk['copy'],
    ready: Disk['ready'],
}

let disk: IDiskProvider;

export function createDiskProvider () : IDiskProvider {
    if (!disk) {
        // ! 这里可以通过 IDiskProvider 替换disk模块
        disk = new Disk({ enableSync: false });
    }
    return disk;
}

export function useDisk () {
    return createDiskProvider();
}