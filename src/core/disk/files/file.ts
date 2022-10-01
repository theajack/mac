/*
 * @Author: tackchen
 * @Date: 2022-09-10 22:08:00
 * @Description: Coding something
 */

import { countStringBytes } from '@/lib/utils';
import { fs } from '../saver/saver';
import { FileBase, IFileBaseOption } from './base';
import { FilePaser } from './file-parser';

type TContentType = string | ArrayBuffer | null;

export interface IFileOption extends IFileBaseOption {
    content?: TContentType; // todo
    mimetype?: string;
}

export class File extends FileBase {

    content: TContentType; // ! 原始数据

    mimetype: string;
    fileParser: FilePaser;

    constructor ({
        name,
        content = '',
        entry,
        mimetype = 'text/plain'
    }: IFileOption) {
        super({ name, entry });
        this.mimetype = mimetype;
        this.type = 'file';
        this.content = content;
        this.fileParser = new FilePaser(this);
    }

    countSize () {
        if (this.content === null) return 0;
        if (this.content instanceof ArrayBuffer) return this.content.byteLength / 1024;
        return countStringBytes(this.content) / 1024; // kb
    }

    copy () {
        return new File({
            name: this.name,
            content: this.content
        });
    }

    read () {
        return this.fileParser.parse();
    }

    // 同步file
    async readFromDisk () {
        this.content = await fs().reader.read({
            path: this.path,
            mimetype: this.mimetype,
        });
        return this.read();
    }

    async writeText (str: string, append = false) {
        this.content = str; // todo
        await fs().reader.write({
            path: this.path,
            data: str,
            append,
        });
    }
}