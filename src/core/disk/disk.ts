/*
 * @Author: tackchen
 * @Date: 2022-09-07 12:05:16
 * @Description: Coding something
 */

import { Dir, IDirOption } from './files/dir';
import { initFilerSaver } from './saver/saver';

export interface IDiskOption extends IDirOption {
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
        const children = initFilerSaver();
        super({
            name: 'disk',
        });
        this.capacity = capacity;
        this.parent = null;
        this.path = '';

        Disk.instance = this;
    }
}