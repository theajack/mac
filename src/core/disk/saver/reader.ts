/*
 * @Author: tackchen
 * @Date: 2022-10-01 20:49:45
 * @Description: Coding something
 */
import { readFile } from '@/lib/utils';
import { promiseify } from './promiseify-map';
import { File } from '../files/file';

export type TWriteType = string|object|File|Blob|ArrayBuffer|null;

interface IReaderBase {
    path: string;
    mimetype?: string; // mimetype https://blog.csdn.net/huyanpeng1988/article/details/47173385
}

export class FilerReader {
    file: File;
    filer: any;

    constructor (filer: any) {
        this.filer = filer;
    }

    async read ({ path, mimetype = 'text/plain' }: IReaderBase) {
        const file = await promiseify(this.filer.open)(path);
        const result = await readFile(file, mimetype);
        return result;
    }

    async write ({
        path,
        content = '',
        mimetype = 'text/plain',
        append = false,
    }:{
        content?: TWriteType,
        append?: boolean
    } & IReaderBase) {

        if (content === null) {
            content = 'null';
        } else if (content.toString() === '[object Object]') {
            content = JSON.stringify(content);
        }

        try {
            return await promiseify(this.filer.write)(path, { data: content, type: mimetype, append });
        } catch (e) {
            console.error(e);
            throw new Error('Write failed: ' + path);
        }
    }
}