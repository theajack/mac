/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { createApp } from 'vue';
import { App } from '../../app';
import { AppNames, createEmptyStatus } from '../../app-config';
import { IAppStatus } from '../../type';
import FinderUI from './finder-ui.vue';

const status: IAppStatus = createEmptyStatus();

export class Finder extends App {

    constructor () {
        super({
            name: AppNames.finder,
            status,
        });
    }
    async onOpen () {
        const window = await this.openNewWindow();
        const app = createApp(FinderUI);
        app.mount(window.dom);
        window.app = app;
    }

}