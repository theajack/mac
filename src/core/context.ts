/*
 * @Author: tackchen
 * @Date: 2022-10-05 09:37:25
 * @Description: Coding something
 */

import { Ref, ref } from 'vue';
import { getOSInstance } from './os/os';
import { IJson } from './type';

const StoreMap: IJson<Ref<any>> = {};

function getStore<T = any> (name: string, value: T): Ref<T> {
    if (!StoreMap[name]) {
        StoreMap[name] = ref(value);
    }

    return StoreMap[name];
}

export function getOS () {
    return getStore('os', getOSInstance());
}

export function getDockApps () {
    return getStore('dock-apps', getOSInstance().appManager.dockApps);
}

export function getApps () {
    return getStore('apps', getOSInstance().appManager.installedApps);
}

export function getRunningApps () {
    return getStore('running-apps', getOSInstance().appManager.runningApps);
}

export function getAppConfig () {
    return getStore('app-config', getOSInstance().appManager.appConfig);
}

export function getAppManager () {
    return getStore('app-manager', getOSInstance().appManager);
}

export function getFile (path: string) {
    // return getStore('app-config', getOS().appManager.appConfig);
    // todo
    return getOSInstance().disk.findFileByPath(path);
}