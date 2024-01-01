/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { markRaw } from 'vue';
import { App } from '../../app';
import { AppNames, createEmptyStatus } from '../../app-config';
import FinderUI from './finder-ui.vue';

export class Finder extends App {

    statusMenu = createEmptyStatus('Finder');

    newWindowOptions = markRaw({
        component: FinderUI,
        height: 0.6
    });
    constructor () {
        super({
            name: AppNames.finder,
        });
    }
}