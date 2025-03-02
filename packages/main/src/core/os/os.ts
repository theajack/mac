/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:17:40
 * @Description: Coding something
 */

import { AppManager } from '../apps/app-manager';
import { initAudioPlayer } from '../audio';
import { Dir } from '@/weoos-polyfill';
import './os.d';
import { MacEvent } from './event-bus';
import type { IDiskProvider } from '@/weoos-polyfill/disk-provider';
import { createDiskProvider } from '@/weoos-polyfill/disk-provider';

const OsName = Symbol('os');

export class OS {
    static instance: OS;
    static OsName = OsName;

    appManager: AppManager;

    _disk: IDiskProvider;

    disk: Dir;
    constructor () {
        if (OS.instance) return OS.instance;
        this._disk = createDiskProvider();
        this.disk = new Dir({ path: '/', name: '' });
        OS.instance = this;
        // @ts-ignore
        window.os = this;
        MacEvent.emit('os-inited', this);
    }

    // 初始化系统
    // 安装基础app
    async init () {
        initAudioPlayer();
        await this._disk.ready;
        await this.disk.initChildren();
        this.appManager = new AppManager(this);
        await this.appManager.initAppsDirectory();
        // console.log(this.disk.deepLs());
    }

    get currentApp () {
        return this.appManager.currentApp;
    }
    get currentWindow () {
        return this.appManager.currentWindow;
    }
}

export function getOS (): OS {
    return OS.instance;
}

export function getDisk () {
    return OS.instance.disk;
}

export function getCurrentApp () {
    return OS.instance.currentApp;
}

export function getLatestWindow () {
    return OS.instance.currentWindow;
}
// @ts-ignore
window.getLatestWindow = getLatestWindow;

export async function createOS () {
    if (OS.instance) return OS.instance;
    const os = new OS();
    await os.init();
    return os;
}