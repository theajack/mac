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

export function createWaiter<T = void> () {

    let inProcess = false;
    let done = false;
    const waitList: any[] = [];
    let result: T;

    return async (process: ()=>Promise<T>) => {
        if (done) {
            console.log('done');
            return result;
        }
        console.log(`inProcess=${inProcess}`);
        if (inProcess) {
            const { ready, resolve } = withResolve();
            waitList.push(resolve);
            return ready;
        } else {
            inProcess = true;
            result = await process();
            done = true;
            console.log(`process finish`);
            waitList.forEach(fn => {
                fn(result);
            });
            return result;
        }
    };

}