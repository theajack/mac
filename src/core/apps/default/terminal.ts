/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames, createEmptyStatus } from '../app-config';
import { IAppStatus } from '../type';
import { createTerm } from 'webos-term';
import { nextTick } from 'vue';

const status: IAppStatus = createEmptyStatus();

export class Terminal extends App {

    constructor () {
        super({
            name: AppNames.terminal,
            status,
        });
    }

    async onOpen () {
        const window = this.openNewWindow();
        await nextTick();
        createTerm({ container: window.dom });
    }
}