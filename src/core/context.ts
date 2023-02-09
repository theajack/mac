/*
 * @Author: tackchen
 * @Date: 2022-10-05 09:37:25
 * @Description: Coding something
 */

import { IToastData } from '@/ui/components/common/toast/toast';
import { Ref, ref } from 'vue';
import { getOSInstance, OS } from './os/os';
import { IJson } from './type';

const StoreMap: IJson<Ref<any>> = {};

function getStore<T = any> (name: string, value: T): Ref<T> {
    if (!StoreMap[name]) {
        StoreMap[name] = ref(value);
    }
    return StoreMap[name];
}

function createGetStoreFunc<T = any> (name: string, func: ()=>T) {
    return (): Ref<T> => {
        if (StoreMap[name]) return StoreMap[name];
        return getStore<T>(name, func());
    };
}

export const getToast = createGetStoreFunc<IToastData>('toast', () => ({
    content: '', visible: false
}));

export const getOS = createGetStoreFunc<OS>('os', getOSInstance);

export function getDockApps () {
    return getOS().value.appManager.dockApps;
}
export function getTempDockApps () {
    return getOS().value.appManager.tempDockApps;
}
export function getTrash () {
    return getOS().value.appManager.trash;
}

export function getApps () {
    return getOS().value.appManager.installedApps;
}

export function getRunningApps () {
    return getOS().value.appManager.runningApps;
}

export function getAppConfig () {
    return getOS().value.appManager.appConfig;
}

export function getAppManager () {
    return getOS().value.appManager;
}

export function getFile (path: string) {
    // return getStore('app-config', getOS().appManager.appConfig);
    // todo
    return getOS().value.disk.findFileByPath(path);
}

export const isDev = location.host.indexOf('localhost:') === 0;