/*
 * @Author: tackchen
 * @Date: 2022-09-25 20:42:26
 * @Description: Coding something
 */

import type { Dir, File } from 'webos-term';
import type { OS } from '../os/os';
import type { IAppConfig } from './app-config';
import { AppNames } from './app-config';
import { createApp, createDefaultApps } from './app-config';
import type { IJson } from '../type';
import type { App } from './app';
import { StringText } from '../string';
import { mainStatus } from '../status/main-status';
import type { IWindowStatus, Window } from '../os/window/window';
import { reactive } from 'vue';
import type { Trash } from './built-in/trash';
import type { Finder } from './built-in/finder/finder';

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

    trash: Trash; // 垃圾桶

    finder: Finder;

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

    private excludeApp (name: AppNames) {
        const index = this.installedApps.findIndex(app => app.name === name);
        return this.installedApps.splice(index, 1)[0] as App;
    }

    private async initApps () {
        const config = this.appConfigFile.content as IJson<IAppConfig>;
        // todo 改名字的话需要这里delete config.key 调试一下
        // debugger
        const all: Promise<App>[] = [];

        for (const key in config) {
            const value = config[key];
            const app = createApp(value);
            if (app) {
                all.push(app);
            }
        }

        const installApps = await Promise.all(all);

        this.installedApps = installApps;
        this.trash = this.excludeApp(AppNames.trash) as Trash;
        this.finder = installApps.find(app => app.name === AppNames.finder) as Finder;

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