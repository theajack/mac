/*
 * @Author: tackchen
 * @Date: 2022-09-11 07:58:38
 * @Description: Coding something
 */

import { isDev } from '@/core/context';
import type { IPos } from '@/core/type';
import { markRaw } from 'vue';

export function cache (
    // @ts-ignore
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const { get } = descriptor; // 获取原来方法
    descriptor.get = function () {
        const target = this as any;
        let v = target[`__${propertyKey}`];
        if (!v) {
            v = target[`__${propertyKey}`] = get?.call(target);
        }
        return v;
    };
}

export function countStringBytes (str: string): number {
    let totalLength = 0;
    let i;
    let charCode;
    for (i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i);
        if (charCode < 0x007f) {
            totalLength = totalLength + 1;
        } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
            totalLength += 2;
        } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
            totalLength += 3;
        }
    }
    return totalLength;
}
export function uuid () {
    const s: any[] = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);

    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = '-';
    s[13] = '-';
    s[18] = '-';
    s[23] = '-';
    const uuid = s.join('');
    return uuid;
}

export function timeId () {
    return Date.now().toString().substring(3) + random(100000, 999999);
}

export function random (a: number, b: number) {
    return (a + Math.round(Math.random() * (b - a)));
}


export function log (...args: any[]) {
    const logType = args[0];
    let fn = 'log';
    if (typeof logType === 'string' && typeof (console as any)[logType] !== 'undefined') {
        fn = logType;
    }
    (console as any)[fn]('[OS] ', ...args);
}

export function basePromiseify<T = any> (
    func: (...args: any[]) => void
) {
    return (...args: any[]) => {
        return new Promise<T>((resolve, reject) => {
            func(...args, (data: T) => {
                resolve(data);
            }, (err: any) => {
                console.error(err);
                reject(err);
            });
        });
    };
}

export function readFile (file:File, mimetype = 'text/plain') {
    return new Promise<any>((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target?.result || null);
        };
        if (mimetype === 'text/plain') {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
            // todo 其它类型
        }
    });
}

export function parseJson (str: string): object | null {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

export async function importScript (url: string) {
    return new Promise<boolean>((resolve) => {

        const script = document.createElement('script');

        script.onload = () => {
            resolve(true);
        };

        script.onerror = (e) => {
            console.error(e);
            throw new Error();
        };

        script.src = url;
    });
}

export function charSplitToSpaceSplit (name: string, split = '-'): string {
    const arr = name.split(split);
    return arr.map(item => item[0].toUpperCase() + item.slice(1)).join(' ');
}

export function delay (time = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}


// Fri Oct 7 21:40
export function buildDate () {
    const date = new Date();

    const day = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat' ][date.getDay()];

    const month = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][date.getMonth()];

    return {
        date: `${day} ${month} ${date.getDate()}`,
        time: `${fixNumber(date.getHours())}:${fixNumber(date.getMinutes())}`
    };
}

export function fixNumber (number: number) {
    return number < 10 ? `0${number}` : number;
}

export function transformSize (base: number, value?: number|string, defRate = 0.8) {
    if (typeof value === 'string') return value;
    if (!value) return base * defRate;
    if (value < 1) return base * value;
    return value;
}

export function createDoubleClick (gap = 400) {
    let start = -1;

    return () => {
        const now = Date.now();
        if (start < 0) {
            start = now;
            return false;
        } else {
            if (now - start < gap) {
                start = -1;
                return true;
            } else {
                start = now;
                return false;
            }
        }
    };
}

export function resource (name: string) {
    const base = isDev ? '/mac/' : 'https://cdn.shiyix.cn/mac/';
    return `${base}assets/${name}`;
}

export function appIcon (name: string) {
    return resource(`icons/${name}.png`);
}

export function handleComponent (data: any) {
    if (data?.component) {
        data.component = markRaw(data.component);
    }
}

export function isUrl (value: string) {
    return /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/.test(value);
}

export function degToArc (deg: number) {
    return deg * Math.PI / 180;
}

export function fetchProcess (url: string, onprogress: (progress: number)=>void) {
    fetch(url)
        .then((response: any) => {
            const totalSize = response.headers.get('Content-Length');
            const reader = response.body.getReader();
            let receivedSize = 0;

            function read () {
                reader.read().then(({ done, value }: {done: boolean, value: any}) => {
                    if (done) {
                    // 图片加载完成
                        return;
                    }
                    receivedSize += value.length;
                    const progress = (receivedSize / totalSize) * 100;
                    // 更新进度条
                    onprogress(progress);
                    // 继续读取下一部分数据
                    read();
                });
            }

            // 开始读取数据
            read();

            // 将加载的图片显示在页面上
            return null;
        });
}

export function throttle (fn: any, time = 500) {
    let timer: any = null;
    return (...args: any[]) => {
        if (timer) return;
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, time);
    };
}

export function upcaseFirstLetter (v: string) {
    return v.split(' ').map(s => (
        s[0].toUpperCase() + s.substring(1)
    )).join(' ');
}

export function getHost () {
    const host = location.host;

    const def = 'theajack.gitee.io';

    if ([
        def,
        'theajack.github.io',
        'shiyix.cn'
    ].includes(host)) {
        return host;
    }
    return def;
}

// halfWidth halfHeight
export function isTwoRectIntersect (
    oPos1: IPos, hw1: number, hh1: number,
    oPos2: IPos, hw2: number, hh2: number,
) {
    return (
        Math.abs(oPos1.x - oPos2.x) < hw1 + hw2 &&
        Math.abs(oPos1.y - oPos2.y) < hh1 + hh2
    );
}

export function isClick (pos1: IPos, pos2: IPos) {
    return (Math.abs(pos1.x - pos2.x) < 3 && Math.abs(pos1.y - pos2.y) < 3);
}