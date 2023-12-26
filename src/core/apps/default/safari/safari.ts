/*
 * @Author: tackchen
 * @Date: 2022-09-22 10:11:01
 * @Description: Coding something
 */
import { App } from '../../app';
import { AppNames } from '../../app-config';
import SafariUI from './safari-ui.vue';
import SafariHeader from './safari-header.vue';
import { MacEvent } from '@/core/os/event-bus';
import { createSafariStore } from './safari-store';

export class Safari extends App {

    constructor () {
        super({
            name: AppNames.safari
        });

        MacEvent.on('new-window', async ({ name, data }) => {
            console.log(name, data);
            if (name === this.name) {
                const window = await this.onOpen();
                const store = createSafariStore(window.id);
                store.initNewWindow(data);
            }
        });
    }

    async onOpen () {
        return await this.openNewWindow({
            component: SafariUI,
            header: {
                component: SafariHeader,
                height: 45,
            },
            width: 0.6,
            height: 0.8
        });
    }
}