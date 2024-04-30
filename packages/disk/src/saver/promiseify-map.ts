
/*
 * @Author: tackchen
 * @Date: 2022-10-01 22:08:00
 * @Description: Coding something
 */
import { basePromiseify } from '../lib/utils';

const PromiseMap: Map<any, (...args: any[]) => Promise<any>> = new Map();

export function promiseify<T = any> (
    func: any
): (...args: any[]) => Promise<T> {

    let result = PromiseMap.get(func);

    if (!result) {
        result = basePromiseify<T>(func);
        PromiseMap.set(func, result);
    }
    return result;
}