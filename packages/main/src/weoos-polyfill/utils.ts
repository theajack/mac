/*
 * @Author: chenzhongsheng
 * @Date: 2025-02-18 21:24:51
 * @Description: Coding something
 */

import { StringText } from '@/core/string';
import { getFileName, isMac, withResolve } from '@/weoos-polyfill/temp/os';


export const DiskString = {
    hiddenExt: 'WEBOS_HIDDEN',
};

export enum NameConflictChoose {
    Return,
    Rename,
    Null,
}
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
            let head = '', ext = '';
            if (repeatMark && name.endsWith(repeatMark)) {
                head = name;
            } else {
                [ head, ext ] = FileUtils.splitFileName(name);
            }
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
        return getFileName(path);
    },
    splitLastStr (str: string, split = ' '): [string, string] {
        const i = str.lastIndexOf(split);
        if (i === -1) return [ str, '' ];
        return [ str.substring(0, i), str.substring(i + 1) ];
    },
    parseFilePath (path: string) {
        if (path.indexOf('/') === -1) {
            return [ '', path ];
        }
        return this.splitLastStr(path, '/');
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
    },
    isZip (name: string) {
        return name && name.endsWith('.zip');
    }
};

export function createLocker () {

    let locked = false;
    let lockResolves: any[] = [];

    return {
        lock () {
            locked = true;
        },
        unlock () {
            lockResolves.forEach(fn => fn());
            lockResolves = [];
            locked = false;
        },
        waitUnlock () {
            if (!locked) return;
            const { ready, resolve } = withResolve();
            lockResolves.push(resolve);
            return ready;
        }
    };
}

export function parseJson (str: string): object | null {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

export function isCtrlKey (e: any) {
    return isMac() ? e.metaKey : e.ctrlKey;
}

const SystemPath = new Set([
    '/System',
    ...[
        StringText.command, StringText.desktop,
        StringText.docs, StringText.downloads,
        StringText.applications, StringText.trash
    ].map(name => `/System/${name}`)
]);

export function isSystemPath (path: string) {
    return SystemPath.has(path);
}