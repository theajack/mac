/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { markRaw } from 'vue';
import { App } from '../../app';
import { AppNames, createEmptyStatus } from '../../app-config';
import type { IAppStatus } from '../../type';
import FinderUI from './finder-ui.vue';

const status: IAppStatus = createEmptyStatus();

export class Finder extends App {
    newWindowOptions = markRaw({
        component: FinderUI,
        height: 0.6
    });
    constructor () {
        super({
            name: AppNames.finder,
            status,
        });
    }
}