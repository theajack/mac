/*
 * @Author: tackchen
 * @Date: 2022-09-10 22:08:00
 * @Description: Coding something
 */

import { countStringBytes } from '@/lib/utils';
import { FileBase, IFileBaseOption } from './base';

export interface IFileOption extends IFileBaseOption {
    content?: string; // todo
}

export class File extends FileBase {

    content: string; // todo 其它类型 如 arraybuffer

    constructor ({
        name,
        content = '',
    }: IFileOption) {
        super({ name });
        this.type = 'dir';
        this.content = content;
    }

    countSize () {
        return countStringBytes(this.content) / 1024; // kb
    }

    copy () {
        return new File({
            name: this.name,
            content: this.content
        });
    }
}