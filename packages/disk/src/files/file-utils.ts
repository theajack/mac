import { DiskString } from '../constant';
import { Path } from 'webos-path';

/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-29 14:42:04
 * @Description: Coding something
 */
export const FileUtils = {

    getExtension (filename: string) {
        this.splitFileName(filename)[1];
    },

    splitFileName (filename: string): [string, string] {
        return this.splitLastStr(filename, '.');
    },
    ensureFileRepeatName (name: string, list: {name: string}[], repeatMark = '') {
        const reg = new RegExp(`^(.*?)${repeatMark}(\\(([0-9]*)\\))?$`, 'i');
        let numTail = '';
        while (list.find(item => item.name === name)) {
            const arr = FileUtils.splitFileName(name);
            let head = arr[0];
            const ext = arr[1];
            const result = head.match(reg);
            if (result) {
                head = result[1];
                numTail = `(${parseInt(result[3] || '0') + 1})`;
            }
            name = `${head}${repeatMark}${numTail}${ext ? `.${ext}` : ''}`;
        }
        return name;
    },
    getFileName (path: string) {
        return Path.from(path).last;
    },
    splitLastStr (str: string, split = ' '): [string, string] {
        const i = str.lastIndexOf(split);
        if (i === -1) return [ str, '' ];
        return [ str.substring(0, i), str.substring(i + 1) ];
    },
    // ! 去除转义符
    split (str: string, split = ' ') {
        const arr: string[] = [];
        const n = str.length;
        let text = '';
        let prev = '';
        for (let i = 0; i < n; i++) {
            const s = str[i];
            if (s === split && prev !== '\\') {
                arr.push(text);
                text = '';
            } else {
                text += s;
            }
            prev = s;
        }
        arr.push(text);
        return arr;
    },
    findMaxCommonHead (arr: string[]) {
        let s = '';
        for (let i = 0; i < arr[0].length; i++) {
            const str = s + arr[0][i];
            for (let j = 1; j < arr.length; j++) {
                if (!arr[j].startsWith(str)) {
                    return s;
                }
            }
            s = str;
        }
        return s;
    },
    extractDirPath (path: string) {
        return this.splitLastStr(path, '/')[0] || '/';
    },
    extractFileName (path: string) {
        return this.splitLastStr(path, '/')[1];
    },
    isHiddenFile (name: string) {
        return name.endsWith(`.${DiskString.hiddenExt}`);
    }
};

window.FiluUtils = FileUtils;