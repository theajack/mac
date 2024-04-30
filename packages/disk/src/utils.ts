/*
 * @Author: tackchen
 * @Date: 2022-09-21 15:05:05
 * @Description: Coding something
 */

export function split (str: string, s = '/', last = false): [string, string] {
    const index = last ? str.lastIndexOf(s) : str.indexOf(s);
    if (index === -1 || !s) return [ str, '' ];
    return [ str.substring(0, index), str.substring(index + 1) ];
}

export function withResolve<T=any> () {
    let resolve: (value?: T|PromiseLike<T>)=>any = () => {}, reject: (error?: any)=>any = () => {};
    const ready = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    return { ready, resolve, reject };
}