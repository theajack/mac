/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-13 00:05:14
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-21 01:02:28
 */
const Reg = /^(http|ws)s?:\/\//;

const GetterDecorator: MethodDecorator = (
    target: any, propertyKey: string, descriptor: PropertyDescriptor
) => {
    const sourceMethod = descriptor.get;
    const key = '_' + propertyKey;
    if (!target.__cache_keys) {
        target.__cache_keys = [];
        target.__clear_cache = () => {
            target.__cache_keys.forEach((item: string) => {
                target[item] = undefined;
            });
        };
    }
    target.__cache_keys.push(key);

    descriptor.get = function (this:any) {
        if (typeof this[key] === 'undefined') {
            this[key] = sourceMethod?.call(this);
        }
        return this[key];
    };
};

export class Path {

    static Split = '/';
    static Back = '..';

    path: string;

    constructor (path: string|string[]) {
        this.setPath(path);
    }

    @GetterDecorator get relative () {
        return this.isRoot ? this.path.substring(1) : this.path;
    }

    @GetterDecorator
    get isRoot (): boolean {
        return this.array[0] === '';
    }

    @GetterDecorator
    get isEndWithSplit () { // 结尾是否为 '/'
        return this.last === '';
    }

    @GetterDecorator get array () {
        return this.path ? Path.handleArray(this.path.split(Path.Split)) : [];
    }
    @GetterDecorator get last () {
        const last = this.array[this.array.length - 1];
        if (last === Path.Back) return '';
        return last || '';
    }

    // 最后一层是否是返回上一级
    @GetterDecorator get isLastReverse () {
        if (this.array.length === 0) return false;
        if (this.last === Path.Back) return true;
        return this.last === '' && this.array[this.array.length - 2] === Path.Back;
    }

    @GetterDecorator get parentPath () { // 返回上一级目录
        if (this.array.length === 0) { // len = 0 表示是空字符串
            return Path.Back; // 表示当前目录
        }

        if (this.array.length === 1) { // len = 1 表示 path 中没有 /
            const v = this.array[0];
            return v === Path.Back ? `${v}${Path.Split}${Path.Back}` : Path.Back;
        }
        const value = (this.isLastReverse ?
            [ ...this.array, Path.Back ] :
            this.array.slice(0, this.array.length - 1)
        ).join(Path.Split);
        return (this.isRoot && !value) ? `${Path.Split}${value}` : value;
    }
    setPath (p: string|string[]) {
        this.path = Path.handle(p);
        (this as any).__clear_cache();
    }
    join (...paths: (string|string[])[]) {
        return Path.from(Path.join(this.path, ...paths));
    }
    append (...paths: (string|string[])[]) {
        this.setPath(Path.join(this.path, ...paths));
        return this;
    }
    static handle (p: string|string[]) {
        const v = Array.isArray(p) ?
            p.filter(v => !!v).join(Path.Split) :
            p.trim();
        return (v.substring(v.length - 3) === Path.Back + Path.Split) ? v.substring(0, v.length - 1) : v;
    }

    static join (...paths: (string|string[])[]) {
        let queue: string[] = [];
        let isRoot = false;
        for (let i = 0; i < paths.length; i++) {
            let path = Path.handle(paths[i]);
            if (!path) continue;

            const match = path.match(Reg);

            if (match) path = path.replace(match[0], '');

            const array = path.split(Path.Split);

            if (match) array.unshift(match[0].replace('://', ':/'));

            if (array[0] === '') {
                queue = array;
                if (!isRoot)isRoot = true;
            } else {
                queue.push(...array);
            }
        }

        const resultQueue: string[] = [];
        const reverseQueue: string[] = [];

        for (let i = 0; i < queue.length; i++) {
            const value = queue[i];
            if (value === '.') {
                // ignore
                continue;
            } else if (!value) {
                if (i === 0 || i === queue.length - 1) {
                    resultQueue.push(value);
                }
            } else if (value === Path.Back) {
                if (resultQueue.length === 0) {
                    if (!isRoot) reverseQueue.push(value);
                } else {
                    resultQueue.pop();
                }
                if (i === queue.length - 1) {
                    // 最后一个返回上一级需要加一个 '/'
                    resultQueue.push('');
                }
            } else {
                resultQueue.push(value);
            }
        }
        let value = reverseQueue.concat(resultQueue).join(Path.Split);
        if (isRoot && value[0] !== Path.Split) {
            value = Path.Split + value;
        }
        return value;
    }
    // static join (...paths: (string|string[])[]) {
    //     console.warn('【join start】', paths);
    //     let queue: string[] = [];
    //     const reverse: string[] = [];
    //     let isRoot = false;
    //     const isLastReverse = !!/(((.*?)\/)|(^))\.\.\/?$/.test(Path.handle(paths[paths.length - 1]));
    //     for (let i = 0; i < paths.length; i++) {
    //         const path = Path.handle(paths[i]);

    //         for (let j = 0; j < path.length; j++) {
    //             const s = path[j];
    //             if (s === Path.Split) {
    //                 if (j === 0) {
    //                     isRoot = true;
    //                     queue = path.split(Path.Split);
    //                     break;
    //                 }
    //             } else if (s === '.') {
    //                 if (path[j + 1] === Path.Split) {
    //                     j ++;
    //                 } else if (path[j + 1] === '.' && (path[j + 2] === Path.Split || j + 2 === path.length)) {
    //                     j += 2;
    //                     if (queue.length === 0) {
    //                         reverse.push(Path.Back);
    //                     } else {
    //                         queue.pop();
    //                     }
    //                 }
    //             } else {
    //                 queue.push(...path.substring(j).split(Path.Split));
    //                 break;
    //             }
    //         }
    //     }
    //     console.log(isRoot, reverse, queue);

    //     const reverseStr = reverse.length === 0 ? '' : `${reverse.join(Path.Split)}${Path.Split}`;

    //     let value = (isRoot ? '' : reverseStr) + Path.handleArray(queue).join(Path.Split);

    //     if (!value && isRoot) value = Path.Split;
    //     if (isLastReverse && queue.length > 0 && value[value.length - 1] !== Path.Split) {
    //         // 最后一个是返回上一级且有目录 则要加一个 /
    //         value += Path.Split;
    //     }
    //     return value;
    // }

    static from (path: string|string[]) {
        return new Path(path);
    }

    static handleArray (array: string[]) {
        const len = array.length;
        return array.filter((n, i) => (i === 0 || i === len - 1 || n !== ''));
    }
}

(window as any).Path = Path;