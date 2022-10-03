/*
 * @Author: tackchen
 * @Date: 2022-09-25 20:42:26
 * @Description: Coding something
 */

import { Dir } from '../disk/files/dir';
import { OS } from '../os/os';
import { createDefaultApps } from './app-config';
import { IApp } from './type';

export class AppManager {
    static DIR_NAME = '__Applications';
    static CONFIG_FILE_NAME = '__AppConfig.json';

    appDir: Dir;
    appConfigFile: File;

    appConfig: {
        installedApps: string[],
        dockApps: string[],
    };

    installedApps: IApp[];
    runningApps: IApp[];
    dockApps: IApp[];
    currentApp: IApp;

    parent: OS;

    constructor (os: OS) {
        this.parent = os;
        this.initAppsDirectory();
    }

    private async initAppsDirectory () {
        const { disk } = this.parent;
        this.appDir = await disk.createDir({
            name: AppManager.DIR_NAME,
        }, {
            returnIfExists: true,
        }) as Dir;
        await this.initAppConfig();
        await this.initInstalledApps();
    }

    private async initAppConfig () {
        this.appConfigFile = await this.appDir.createFile({
            name: AppManager.CONFIG_FILE_NAME,
            content: createDefaultApps()
        }, {
            returnIfExists: true,
        }) as any as File;
    }

    private async initInstalledApps () {
        this.appConfigFile;
    }
}