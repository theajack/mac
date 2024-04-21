/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-21 09:04:16
 * @Description: Coding something
 */
import type { IJson, Class } from '@/types';

export function createUseInstance<T extends Class> (Class: T): ((id: number|string)=>InstanceType<T>) {
    const Map: IJson<InstanceType<T>> = {};
    return (id: number|string) => {
        if (!Map[id]) {
            // @ts-ignore
            Map[id] = new Class();
        }
        return Map[id];
    };
}