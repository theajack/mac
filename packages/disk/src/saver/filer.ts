/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-22 23:07:27
 * @Description: Coding something
 */
import { log } from '../lib/utils';
import { promiseify } from '../saver/promiseify-map';
import Filer from 'filer.js';
import type { FileBase } from '../files/base';
import { Dir } from '../files/dir';
import { withResolve } from '../utils';
import { File } from '../files/file';
import { FileUtils } from '../files/file-utils';

export function fs () {
    return new DiskFiler();
}
export class DiskFiler {
    static instance: DiskFiler;
    filer: any;

    constructor () {
        if (DiskFiler.instance) return DiskFiler.instance;
        this.filer = new (Filer as any)();
        (window as any).filer = this.filer;
        DiskFiler.instance = this;
    }

    async initFS ({
        persistent = false,
        size = 1024 * 1024,
    }: {
        persistent?: boolean,
        size?: number,
    } = {}) {
        const { ready, resolve, reject } = withResolve();
        this.filer.init({ persistent, size }, () => { // fs: any
            // filer.size == Filer.DEFAULT_FS_SIZE
            // filer.isOpen == true
            // filer.fs == fs
            // console.log(fs);
            resolve();
        }, (e: any) => {
            console.error(e);
            reject();
        });
        return ready;
    }

    // ! 从FileSystem中初始化所有文件
    async initFiles (parent: Dir) {
        const files = await this._initDir(parent.path.path || '/');
        parent.initChildren(files);
    }

    createFile (path: string) {
        return promiseify(this.filer.create)(path, true);
    }

    mkdir (path: string) {
        const { ready, resolve, reject } = withResolve<FileBase[]>();
        const index = path.lastIndexOf('/');
        const dir = path.substring(0, index) || '/';
        const name = path.substring(index + 1);
        // ! 先进入父目录再mkdir，直接根据绝对路径mkdir无法拿到success回调
        this.cd(dir).then(() => {
            this.filer.mkdir((name), true, (entry: any) => {
                resolve(entry);
            }, () => {
                reject();
            });
        });
        return ready;
        // return promiseify(this.filer.mkdir)(path, true);
    }

    cd (path: string) {
        return promiseify(this.filer.cd)(path);
    }

    rm (path: string) { // , isDir: boolean
        // log('warn', 'rm ' + path, isDir);
        return promiseify(this.filer.rm.bind(this.filer))(path);
    }

    // Displays disk space usage.
    df (): Promise<{used: number, free: number, capacity: number}> {
        const { ready, resolve, reject } = withResolve();
        this.filer.df((used: number, free: number, capacity: number,) => {
            resolve({ used, free, capacity });
        }, (e: any) => {
            reject(e);
        });
        return ready;
    }

    // cp('/a/b.txt', '/a/c')
    cp (source: string, targetDir: string, newName = '') {
        return promiseify(this.filer.cp)(source, targetDir, newName);
    }

    // mv('/a/b.txt', '/a/c')
    mv (source: string, target: string, newName = '') {
        return promiseify(this.filer.mv)(source, target, newName);
    }
    rename (path: string, newName: string) {
        return promiseify(this.filer.mv)(path, FileUtils.extractDirPath(path), newName);
    }

    private async _initDir (path: string): Promise<FileBase[]> {
        log('travese', path);
        const files = await promiseify<any[]>(this.filer.ls)(path);
        if (files.length === 0) return [];
        // @ts-ignore
        return Promise.all(files.map(async entry => {
            // console.warn('---', path, entry);
            const { isDirectory, name } = entry;
            const options = { name, entry, path: entry.fullPath };
            return (isDirectory) ?
                new Dir({ ...options, children: await this._initDir(entry.fullPath) }) :
                new File(options);
        }));
    }
    async getNativeFile (path: string): Promise<NFile> {
        const file = await promiseify(this.filer.open)(path);
        return file;
    }

    async writeBinary ({
        path,
        content = '',
        mimetype = 'text/plain',
        append = false,
    }:{
        path: string;
        mimetype?: string;
        content?: any,
        append?: boolean
    }) {

        try {
            return await promiseify(this.filer.write)(path, { data: content, type: mimetype, append });
        } catch (e) {
            console.error(e);
            throw new Error('Write failed: ' + path);
        }
    }

    async write ({
        path,
        content = '',
        mimetype = 'text/plain',
        append = false,
    }:{
        path: string;
        mimetype?: string;
        content?: any,
        append?: boolean
    }) {

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