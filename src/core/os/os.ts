/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:17:40
 * @Description: Coding something
 */

import { IApp } from '../apps/type';
import { Disk } from '../disk/disk';
import './os.d';

const OsName = Symbol('os');

export class OS {
    static OsName = OsName;
    installedApps: IApp[];
    runningApps: IApp[];
    currentApp: IApp;
    dockApps: IApp[];

    disk: Disk;
    constructor () {
        this.disk = new Disk({
            onready: () => {
                this.init();
            }
        });
    }

    // 初始化系统
    // 安装基础app
    private init () {
        console.log(this.disk.deepLs());
    }
}