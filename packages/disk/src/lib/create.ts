/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-29 23:36:02
 * @Description: Coding something
 */
import { withResolve } from '../utils';

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