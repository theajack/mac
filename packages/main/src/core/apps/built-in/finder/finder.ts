/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { markRaw } from 'vue';
import { App } from '../../app';
import { AppNames, createEmptyStatus } from '../../app-config';
import FinderUI from './finder-ui.vue';
import FinderHeader from './finder-header.vue';
import type { IWindowOptions } from '@/core/os/window/window';

export class Finder extends App {

    statusMenu = createEmptyStatus('Finder');

    newWindowOptions: IWindowOptions = markRaw({
        component: FinderUI,
        background: 'transparent',
        height: 600,
        width: 900,
        header: {
            component: FinderHeader,
            height: 50,
            bgColor: 'transparent'
        }
    });

    constructor () {
        super({
            name: AppNames.finder,
        });
    }

    cd () {

    }
}