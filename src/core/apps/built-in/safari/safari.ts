/*
 * @Author: tackchen
 * @Date: 2022-09-22 10:11:01
 * @Description: Coding something
 */
import { App } from '../../app';
import { AppNames, createEmptyStatus } from '../../app-config';
import SafariUI from './safari-ui.vue';
import SafariHeader from './safari-header.vue';
import type { ICallAppInfo } from '@/core/os/event-bus';
import { MacEvent } from '@/core/os/event-bus';
import type { ITabItem } from './safari-store';
import { useSafariStore } from './safari-store';
import { markRaw, nextTick } from 'vue';
import type { IAppMessage } from '../../type';

export class Safari extends App {
    statusMenu = createEmptyStatus('Safari');

    newWindowOptions = markRaw({
        component: SafariUI,
        header: {
            component: SafariHeader,
            height: 45,
        },
    });

    constructor () {
        super({
            name: AppNames.safari,
            msgCount: 1,
        });
    }

    async onAppCall ({ data }: ICallAppInfo) {
        const window = this.ref.openNewWindow();
        await nextTick();
        const store = useSafariStore(window.id);
        store.initNewWindow(data as ITabItem);
    }

    openNewWindow () {
        this.msgCount = 0;
        return super.openNewWindow();
    }
}