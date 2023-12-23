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
        console.log(this.disk.deepLs());
    }
}

export function getOSInstance () {
    return OS.instance;
}

export async function createOS () {
    if (OS.instance) return OS.instance;
    const os = new OS();
    await os.init();
    return os;
}