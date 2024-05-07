/*
 * @Author: chenzhongsheng
 * @Date: 2024-05-06 17:07:21
 * @Description: Coding something
 */
import JSZip from 'jszip';
import type { FileBase } from '../files/base';
import type { File } from '../files/file';
import type { Dir } from '../files/dir';

interface IZipProgressData {
    count: number;
    curName: string;
    curIndex: number;
    curSize: number;
    path: string
}
interface IUnZipProgressData extends IZipProgressData {
    data: Uint8Array;
    isDir: boolean;
}
async function zipFiles (
    zip: JSZip,
    files: FileBase[],
    onProgress?: (data: IZipProgressData)=>void,
    count = 0,
    basePath = ''
) {
    const curSize = files.length;
    let curIndex = 0;
    for (const file of files) {
        curIndex ++;
        const path = `${basePath}/${file.name}`;
        if (file.isDir) {
            const folder = zip.folder(path);
            await zipFiles(folder!, (file as Dir).allChildren, onProgress, count, path);
        } else {
            zip.file(path, await (file as File).read(), { binary: true });
        }
        count ++;
        if (onProgress) {
            onProgress({ count, curIndex, curSize, curName: file.name, path });
        }

    }
}

export const ZipUtils = {
    async zip (files: FileBase[], onProgress?: (data: IZipProgressData)=>void): Promise<Uint8Array> {
        const zip = new JSZip();
        await zipFiles(zip, files, onProgress);
        return zip.generateAsync({ type: 'uint8array' });
    },
    async unzip (file: File, onProgress?: (data: IUnZipProgressData)=>void ): Promise<IUnZipProgressData[]> {
        const data = await file.read();
        return this.unzipU8Arr(data, onProgress);
    },

    async unzipU8Arr (data: Uint8Array, onProgress?: (data: IUnZipProgressData)=>void): Promise<IUnZipProgressData[]> {
        const zip = await JSZip.loadAsync(data);
        let count = 0;

        const files = zip.files;
        const curSize = Object.keys(files).length;

        const list: IUnZipProgressData[] = [];

        for (const key in zip.files) {
            const file = zip.files[key];
            const data = await file.async('uint8array');
            count ++;
            const result: IUnZipProgressData = {
                curName: file.name,
                count,
                curIndex: count,
                curSize,
                data,
                path: key,
                isDir: file.dir,
            };
            onProgress?.(result);
            list.push(result);
        }

        return list;
    }
};