/*
 * @Author: tackchen
 * @Date: 2022-09-22 10:11:01
 * @Description: Coding something
 */
import { App } from '../../app';
import { AppNames, createEmptyStatus } from '../../app-config';
import SafariUI from './safari-ui.vue';
import SafariHeader from './safari-header.vue';
import { MacEvent } from '@/core/os/event-bus';
import { useSafariStore } from './safari-store';
import { markRaw, nextTick } from 'vue';

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

        MacEvent.on('new-window', async ({ name, data }) => {
            console.log(name, data);
            if (name === this.name) {
                const window = this.openNewWindow();
                await nextTick();
                const store = useSafariStore(window.id);
                store.initNewWindow(data);
                // await nextTick();
                // document.getElementById(`SAFARI_ITEM_${window.id}_${data.id}`)?.appendChild(iframe);
            }
        });
    }

    openNewWindow () {
        this.msgCount = 0;
        return super.openNewWindow();
    }
}