/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-27 15:26:31
 * @Description: Coding something
 */
import type { IWindowOptions } from '../os/window/window';
import type { IAppOptions } from './app';
import { App } from './app';
import WebWindow from '@/ui/components/common/window/web-window-body.vue';

export class WebApp extends App {
    url: string;
    constructor (options: IAppOptions & {
        url: string,
    }) {
        super(options);
        this.url = options.url;
    }
    onOpen (): void {
        this.openNerWebWindow();
    }
    async openNerWebWindow (options: IWindowOptions = {}) {
        if (!options.url) options.url = this.url;
        const header = options.header;
        if (header) {
            if (header.component && header.title) {
                header.enable = false;
            }
        } else {
            options.header = { enable: false };
        }
        if (!options.header!.height) {
            options.header!.height = 20;
        }
        if (!options.component) options.component = WebWindow;
        return super.openNewWindow(options);
    }
}