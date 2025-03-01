/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:17:40
 * @Description: Coding something
 */

import { AppManager } from '../apps/app-manager';
import { initAudioPlayer } from '../audio';
import type { IDirOption } from '@/weoos-polyfill';
import { Dir, Disk, File, getFileName, pt, useDisk } from '@/weoos-polyfill';
import './os.d';
import { MacEvent } from './event-bus';

const OsName = Symbol('os');

export class OS {
    static instance: OS;
    static OsName = OsName;

    appManager: AppManager;

    _disk: Disk;

    disk: Dir;
    constructor () {
        if (OS.instance) return OS.instance;
        this._disk = new Disk({ enableSync: true });
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
        await this._disk.traverse('/', ({ path, name }) => {

        });
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

    async findChildByPath (path: string) {
        const type = await (await useDisk()).getType(path);

        if (type === 'empty') return null;
        if (type === 'dir') {
            return new Dir({ path });
        }
        return new File({ path });
    }
    async findFileByPath (path: string) {
        const type = await (await useDisk()).getType(path);
        if (type === 'dir' || type === 'empty') return null;
        return new File({ path });
    }
    async findDirByPath (path: string) {
        const type = await (await useDisk()).getType(path);
        if (type !== 'dir') return null;
        return new Dir({ path });
    }

    async ensureDir (options: IDirOption) {
        const path = options.path || pt.join('/', options.name!);
        (await useDisk()).createDir(path, { ensure: true });
        return new Dir({ name: getFileName(path), path });
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