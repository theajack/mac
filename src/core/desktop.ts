import { App } from 'vue';
import { Dock } from './dock';
import { StatusBar } from './status-bar';

/*
 * @Author: tackchen
 * @Date: 2022-09-04 17:06:26
 * @Description: 桌面入口
 */
export class Desktop {
    dock: Dock;
    statusBar: StatusBar;

    constructor () {
        this.dock = new Dock();
        this.statusBar = new StatusBar();
    }


    install (app: App) {
        console.log(app);
    }
}