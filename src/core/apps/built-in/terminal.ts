/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import type { IWindowOptions } from '@/core/os/window/window';
import { App } from '../app';
import { AppNames, createEmptyStatus } from '../app-config';
import type { IAppStatus } from '../type';
import { createTerm } from 'webos-term';
import { markRaw, nextTick } from 'vue';

const status: IAppStatus = createEmptyStatus();

export class Terminal extends App {

    newWindowOptions: IWindowOptions = markRaw({
        height: 500,
        width: 700,
    });

    constructor () {
        super({
            name: AppNames.terminal,
            status,
            msgCount: 1,
        });
    }

    openNewWindow () {
        this.msgCount = 0;
        const window = super.openNewWindow();
        nextTick().then(() => {
            createTerm({ container: window.dom });
        });
        return window;
    }
}