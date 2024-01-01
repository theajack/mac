/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-27 15:26:31
 * @Description: Coding something
 */
import { markRaw } from 'vue';
import type { IWindowOptions } from '../os/window/window';
import type { IAppOptions } from './app';
import { App, AppType } from './app';
import WebWindow from '@/ui/components/common/window/web-window-body.vue';

export class WebApp extends App {
    newWindowOptions: IWindowOptions = markRaw({
        component: WebWindow,
        header: {
            height: 20,
            enable: false,
        }
    });
    constructor (options: IAppOptions & {
        url: string,
    }) {
        super(Object.assign(options, { appType: AppType.Web }));
        this.newWindowOptions.url = options.url;
    }
}