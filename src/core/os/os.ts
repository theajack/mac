/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:17:40
 * @Description: Coding something
 */

import { AppManager } from '../apps/app-manager';
import { Disk } from '../disk/disk';
import './os.d';

const OsName = Symbol('os');

export class OS {
    static OsName = OsName;

    appManager: AppManager;

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
        this.appManager = new AppManager(this);
    }
}