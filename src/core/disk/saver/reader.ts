/*
 * @Author: tackchen
 * @Date: 2022-10-01 20:49:45
 * @Description: Coding something
 */
import { readFile } from '@/lib/utils';
import { promiseify } from './promiseify-map';
import { File } from '../files/file';

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
        data = '',
        mimetype = 'text/plain',
        append = false,
    }:{
        data?: string|File|Blob|ArrayBuffer,
        append?: boolean
    } & IReaderBase) {
        try {
            await promiseify(this.filer.write)(path, { data, type: mimetype, append });
        } catch (e) {
            console.error(e);
            throw new Error('Write failed: ' + path);
        }
    }
}