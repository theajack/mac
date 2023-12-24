/*
 * @Author: tackchen
 * @Date: 2022-09-25 20:42:26
 * @Description: Coding something
 */

import type { Dir, File } from 'webos-term';
import type { OS } from '../os/os';
import type { IAppConfig } from './app-config';
import { createApp, createDefaultApps } from './app-config';
import type { IJson } from '../type';
import type { App } from './app';
import { StringText } from '../string';
import { mainStatus } from '../status/main-status';
import type { IWindowStatus, Window } from '../os/window/window';
import { reactive } from 'vue';
import type { Trash } from './default/trash';

export class AppManager {
    static DIR_NAME = StringText.appDir;
    static CONFIG_FILE_NAME = StringText.appConfigFile;

    appDir: Dir;
    appConfigFile: File;

    appConfig: {
        installedApps: string[],
        dockApps: string[],
    } = {
            installedApps: [],
            dockApps: [],
        };

    mainStatus = mainStatus;

    installedApps: App[] = [];
    runningApps: App[] = [];

    tempDockApps: App[] = []; // temporary apps not always in dock

    dockApps: App[];
    currentApp: App;

    parent: OS;

    windowStatus: IWindowStatus[] = reactive([]);

    trash: Trash;

    constructor (os: OS) {
        this.parent = os;
    }

    async initAppsDirectory () {
        const { disk } = this.parent;
        this.appDir = await disk.createDir({
            name: AppManager.DIR_NAME,
        }, {
            returnIfExists: true,
        }) as Dir;
        await this.initAppConfig();
        await this.initApps();
        this.currentApp = this.installedApps.find(item => item.name === 'finder') as App;
    }

    refreshConfigFiles () {
        this.appConfigFile.write({ content: createDefaultApps() });
    }

    private async initAppConfig () {
        this.appConfigFile = await this.appDir.createFile({
            name: AppManager.CONFIG_FILE_NAME,
            content: createDefaultApps()
        }, {
            returnIfExists: true,
        }) as any as File;
    }

    private initTrash () {
        const index = this.installedApps.findIndex(app => app.name === 'trash');
        this.trash = this.installedApps[index];
        this.installedApps.splice(index, 1);
    }

    private async initApps () {
        const config = this.appConfigFile.content as IJson<IAppConfig>;

        const all: Promise<App>[] = [];

        for (const key in config) {
            const value = config[key];
            all.push(createApp(value));
        }

        const installApps = await Promise.all(all);

        this.installedApps = installApps;
        this.initTrash();

        this.appConfig.installedApps = installApps.map(item => item.name);

        this.dockApps = installApps
            .filter(item => {
                return typeof config[item.name]?.dockIndex === 'number';
            })
            .sort((a, b) => {
                const aIndex = config[a.name].dockIndex || 0;
                const bIndex = config[b.name].dockIndex || 0;
                return aIndex > bIndex ? 1 : -1;
            });

        this.appConfig.dockApps = this.dockApps.map(item => item.name);
    }

    removeWindowStatus (window: Window) {
        this.windowStatus.splice(
            this.windowStatus.indexOf(window.status),
            1
        );
    }

    enterApp (app: App) {
        app.isRunning = true;
        this.runningApps.push(app);

        if (!this.dockApps.includes(app) && !this.tempDockApps.includes(app)) {
            this.tempDockApps.push(app);
        }
    }
    leaveApp (app: App) {
        app.isRunning = false;
        this.runningApps.splice(
            this.runningApps.indexOf(app),
            1,
        );
    }
}