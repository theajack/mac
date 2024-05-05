/*
 * @Author: tackchen
 * @Date: 2022-09-07 12:05:16
 * @Description: Coding something
 */

import { Dir } from './files/dir';
import { Path } from 'webos-path';
import { fs } from './saver/filer';
import { createWaiter } from './lib/create';

export interface IDiskOption {
    capacity?: number;
}
export class Disk extends Dir {

    isDisk = true;
    static instance: Disk;
    capacity: number;

    private wait = createWaiter();


    constructor ({
        capacity = 1024, // todo 容量
    }: IDiskOption = {}) {
        if (Disk.instance) {
            return Disk.instance;
        }
        super({
            name: 'disk',
        });
        // @ts-ignore
        this.entry = 'DISK';
        this.type = 'disk';
        this.capacity = capacity;
        this.parent = null;
        this.path = new Path('/');

        Disk.instance = this;
    }

    async initFileSystem () {
        console.log('initFileSystem');
        await this.wait(async () => {
            await fs().initFS();
            await fs().initFiles(this);
        });
    }

    clear () {
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].remove();
        }
    }
}

export function getDisk () {
    return new Disk();
}