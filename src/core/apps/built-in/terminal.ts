/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames, createEmptyStatus } from '../app-config';
import type { IAppStatus } from '../type';
import { createTerm } from 'webos-term';

const status: IAppStatus = createEmptyStatus();

export class Terminal extends App {

    constructor () {
        super({
            name: AppNames.terminal,
            status,
            msgCount: 1,
        });
    }

    async onOpen () {
        const window = await this.openNewWindow({
            width: 700,
            height: 500,
        });
        createTerm({ container: window.dom });
        this.msgCount = 0;
    }
}