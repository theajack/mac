import { createUseInstance } from './use-instance';

/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-21 09:03:42
 * @Description: Coding something
 */
class History<T = string> {
    list: T[] = [];

    index = -1;

    get current () {
        return this.list[this.index];
    }

    get size () {
        return this.list.length;
    }

    add (v: T) {
        this.list.splice(this.index + 1);
        this.list.push(v);
        this.forward();
    }

    back () {
        if (this.index > 0) {
            this.index --;
            return true;
        }
        return false;
    }

    forward () {
        if (this.index < this.size - 1) {
            this.index ++;
            return true;
        }
        return false;
    }
}

export function useHistory<T = string> () {
    return createUseInstance(History<T>);
}