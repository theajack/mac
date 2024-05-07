/*
 * @Author: tackchen
 * @Date: 2022-10-05 09:37:25
 * @Description: Coding something
 */

import type { IToastData } from '@/ui/components/common/toast/toast';
import type { Ref } from 'vue';
import { ref } from 'vue';
import type { OS } from './os/os';
import { getOS } from './os/os';
import type { IJson } from './type';
import type { App } from './apps/app';

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

export const getOSRef = createGetStoreFunc<OS>('os', getOS);

export function getDockApps (): App[] {
    return getOSRef().value.appManager.dockApps;
}
export function getTempDockApps () {
    return getOSRef().value.appManager.tempDockApps;
}
export function getTrash () {
    return getOSRef().value.appManager.trash;
}

export function getApps () {
    return getOSRef().value.appManager.installedApps;
}

export function getRealApps () {
    return getOSRef().value.appManager.installedApps.filter(app => !app.isVirtualApp);
}

export function getRunningApps () {
    return getOSRef().value.appManager.runningApps;
}

export function getAppConfig () {
    return getOSRef().value.appManager.appConfig;
}

export function getAppManager () {
    return getOSRef().value.appManager;
}
// @ts-ignore
window.getAppManager = () => getOS().appManager;
// @ts-ignore
window.getOS = getOS;

export function getFile (path: string) {
    // return getStore('app-config', getOSRef().appManager.appConfig);
    // todo
    return getOSRef().value.disk.findFileByPath(path);
}

export const isDev = __DEV__;
// export const isDev = location.host.indexOf('localhost:') === 0;