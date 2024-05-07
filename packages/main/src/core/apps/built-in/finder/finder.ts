/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { markRaw, nextTick } from 'vue';
import { App } from '../../app';
import { AppNames, createEmptyStatus } from '../../app-config';
import FinderUI from './finder-ui.vue';
import FinderHeader from './finder-header.vue';
import type { IWindowOptions } from '@/core/os/window/window';
import type { ICallAppInfo } from '@/core/os/event-bus';
import { FinderUtils } from './js/finder-utils';
import { DiskEvent } from 'webos-term';

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
        },
    });

    constructor () {
        super({
            name: AppNames.finder,
            msgCount: 99,
        });

        DiskEvent.on('disk-dir-change', paths => {
            FinderUtils.refreshAllFinderDirInfo(paths);
        });
    }

    async onAppCall ({ data }: ICallAppInfo) {
        this.openNewWindow();
        await nextTick(); // 等待 ui 初始化之后 store中unmounted才不会异常
        const store = FinderUtils.getStore();
        await store?.entryDir(data.path);
    }
}