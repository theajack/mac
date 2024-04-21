/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:17:40
 * @Description: Coding something
 */

import { AppManager } from '../apps/app-manager';
import { initAudioPlayer } from '../audio';
import { Disk } from 'webos-term';
import './os.d';
import { MacEvent } from './event-bus';

const OsName = Symbol('os');

export class OS {
    static instance: OS;
    static OsName = OsName;

    appManager: AppManager;

    disk: Disk;
    constructor () {
        if (OS.instance) return OS.instance;
        this.disk = new Disk();
        this.appManager = new AppManager(this);
        OS.instance = this;
        MacEvent.emit('os-inited', this);
    }

    // 初始化系统
    // 安装基础app
    async init () {
        initAudioPlayer();
        await this.disk.initFileSystem();
        await this.appManager.initAppsDirectory();
        // console.log(this.disk.deepLs());
    }

    get currentApp () {
        return this.appManager.currentApp;
    }
    get latestWindow () {
        return this.currentApp.findLatestWindow();
    }
}

export function getOS () {
    return OS.instance;
}

export function getDisk () {
    return OS.instance.disk;
}

export function getCurrentApp () {
    return OS.instance.currentApp;
}

export function getLatestWindow () {
    return getCurrentApp().findLatestWindow();
}

window.getLatestWindow = getLatestWindow;

export async function createOS () {
    if (OS.instance) return OS.instance;
    const os = new OS();
    await os.init();
    return os;
}