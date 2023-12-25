/*
 * @Author: tackchen
 * @Date: 2022-09-22 10:11:01
 * @Description: Coding something
 */
import { App } from '../../app';
import { AppNames } from '../../app-config';
import SafariUI from './safari-ui.vue';
import SafariHeader from './safari-header.vue';

export class Safari extends App {

    constructor () {
        super({
            name: AppNames.safari
        });
    }

    async onOpen () {
        await this.openNewWindow({
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