/*
 * @Author: tackchen
 * @Date: 2022-09-07 12:05:16
 * @Description: Coding something
 */

import { Dir } from './files/dir';
import { initFilerSaver } from './saver/saver';

export interface IDiskOption {
    capacity?: number;
}
export class Disk extends Dir {

    static instance: Disk;
    capacity: number;

    constructor ({
        capacity = 1024, // todo 容量
    }: IDiskOption = {}) {
        if (Disk.instance) {
            return Disk.instance;
        }
        super({
            name: 'disk',
        });
        this.capacity = capacity;
        this.parent = null;
        this.path = '';

        Disk.instance = this;
    }

    async initFileSystem () {
        this.children = await initFilerSaver(this);
    }

    clear () {
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].remove();
        }
    }
}