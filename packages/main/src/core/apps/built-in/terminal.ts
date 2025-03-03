/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import type { IWindowOptions } from '@/core/os/window/window';
import { App } from '../app';
import { AppNames, createEmptyStatus } from '../app-config';
import { WebOS } from '@/weoos-polyfill/temp/os';
import { markRaw, nextTick } from 'vue';


export class Terminal extends App {

    statusMenu = createEmptyStatus('Terminal');

    newWindowOptions: IWindowOptions = markRaw({
        height: 500,
        width: 700,
    });

    constructor () {
        super({
            name: AppNames.terminal,
            msgCount: 19,
        });
    }

    openNewWindow () {
        this.msgCount = 0;
        const window = super.openNewWindow();
        nextTick().then(() => {
            new WebOS({
                container: window.dom,
                title: this.getOSTitle(),
            });
        });
        return window;
    }

    getOSTitle () {
        const KEY = 'macos_last-login';

        const time = localStorage.getItem(KEY);
        localStorage.setItem(KEY, `${Date.now()}`);
        return [
            time ?
                `Welcome to MacOS! Last login: ${new Date(parseInt(time)).toLocaleString()} on console\n` :
                'First Login, Welcome MacOS\n',
            'Terminal & FileSystem is Powered by <a target="_blank" style="text-decoration: underline;" href="https://github.com/weoos/os">@weoos/os</a>, try "help" to get more info',
        ].join('\n');
    }
}