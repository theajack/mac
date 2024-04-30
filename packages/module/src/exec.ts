/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-24 01:04:25
 * @Description: Coding something
 */
import { Application, IApplicationOptionsBase } from './application';

export function execModule (arg: string|Function, options: IApplicationOptionsBase) {
    if (typeof arg === 'function') {
        arg = `(${arg.toString()})()`;
    }
    return new Application({
        code: arg,
        ...options
    });
}