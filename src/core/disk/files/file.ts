/*
 * @Author: tackchen
 * @Date: 2022-09-10 22:08:00
 * @Description: Coding something
 */

import { countStringBytes } from '@/lib/utils';
import { TWriteType } from '../saver/reader';
import { fs } from '../saver/saver';
import { FileBase, IFileBaseOption } from './base';
import { FileParser } from './file-parser';

export interface IFileOption extends IFileBaseOption {
    content?: TWriteType; // todo
    mimetype?: string;
}

export class File extends FileBase {

    content: TWriteType;

    mimetype: string;
    fileParser: FileParser;

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
        this.fileParser = new FileParser(this);
    }

    countSize () {
        let byteLength = 0;
        if (typeof this.content === 'string') {
            byteLength = countStringBytes(this.content);
        } else if (this.content === null) {
            byteLength = 0;
        } else if (this.content instanceof ArrayBuffer) {
            byteLength = this.content.byteLength;
        } else if (typeof this.content === 'object') {
            byteLength = countStringBytes(JSON.stringify(this.content));
        }
        return byteLength / 1024; // kb
    }

    copy () {
        return new File({
            name: this.name,
            content: this.content
        });
    }

    async read ({
        refresh = false
    }: {
        refresh?: boolean
    } = {}) {
        if (refresh) {
            // 同步fileSystem
            this.content = this.fileParser.parseRead(await fs().reader.read({
                path: this.path,
                mimetype: this.mimetype,
            }));
        }
        return this.content;
    }

    async write ({
        content,
        append = false
    }: {
        content?: TWriteType,
        append?: boolean,
    } = {}) {
        if (typeof content === 'undefined') {
            content = this.content;
        } else {
            this.content = append ?
                this.fileParser.merge(content) :
                content;
        }

        await fs().reader.write({
            path: this.path,
            content: this.fileParser.parseWrite(),
            append: false, // ! 通过merge做过append了
        });
    }
}