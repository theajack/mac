/*
 * @Author: tackchen
 * @Date: 2022-09-05 19:46:58
 * @Description: Coding something
 */
import { toast } from '@/ui/components/common/toast/toast';
import { MacEvent, sendMessageToApp } from '@core/os/event-bus';
import type { IWindowOptions } from '@/core/os/window/window';
import { Window } from '@/core/os/window/window';
import { OS } from '../os/os';
import { appNameToTitle } from './app-config';
import type { AppManager } from './app-manager';
import type { IAppStatus, IApp, IAppMessageBase, IAppMessage } from './type';
import { markRaw, type App as VueApp } from 'vue';
import { cache, handleComponent, resource } from '@/lib/utils';

export interface IAppOptions {
    name?: string;
    icon?: string;
    iconRadius?: number;
    iconScale?: number|boolean;
    title?: string;
    status?: IAppStatus;
    jumpUrl?: string;
    onMessage?: (data: IAppMessage) => void;
}
export class App implements IApp {
    name: string;
    icon: string;
    iconRadius: string;
    component?: VueApp;
    defCaptureSrc = '';
    title: string;
    status: IAppStatus;
    manager: AppManager;
    jumpUrl: string;
    iconScale: number;
    onMessage?: (data: IAppMessage) => void;

    windows: Window[] = [];

    isRunning = false;

    canBackground = false;

    constructor ({
        name = '',
        icon = '',
        iconRadius = 0.25,
        iconScale = 1,
        title = '',
        status = {} as any,
        onMessage,
        jumpUrl = '',
    }: IAppOptions) {
        this.jumpUrl = jumpUrl;
        this.name = name;
        this.manager = OS.instance.appManager;
        this.icon = icon || resource(`icons/${name}.png`);
        this.iconRadius = iconRadius < 1 ? `${iconRadius * 100}%` : `${iconRadius}px`;
        this.title = title || appNameToTitle(name);
        this.status = status;
        this.iconScale = typeof iconScale === 'number' ? iconScale : (iconScale ? 1.22 : 1);
        this.onMessage = onMessage;

        MacEvent.on('app-message', (data) => {
            if (this.onMessage && data.to === this.name) {
                this.onMessage(data);
            }
        });
    }

    @cache get on () {
        return MacEvent.on.bind(MacEvent) as typeof MacEvent.on;
    }
    @cache get emit () {
        return MacEvent.emit.bind(MacEvent) as typeof MacEvent.emit;
    }


    sendMessageToApp ({
        to,
        data,
    }: IAppMessageBase) {
        sendMessageToApp({
            from: this.name,
            to,
            data
        });
    }

    onOpen () {
        if (this.jumpUrl) {
            window.open(this.jumpUrl);
        } else {
            // todo
            toast({
                from: this,
                content: 'under development...'
            });
        }
    }

    initStatusBar () {

    }

    async openNewWindow (options: IWindowOptions = {
        header: {},
        events: {}
    }) {
        this.status.firstWindowOpen = this.windows.length === 0;
        if (!options.header) options.header = {};
        handleComponent(options);
        if (options.component) {
            options.component = markRaw(options.component);
        }
        if (!this.isRunning) {
            this.manager.enterApp(this);
        }
        handleComponent(options.header);
        if (typeof options.header.title !== 'string') {
            // @ts-ignore
            options.header.title = this.name;
        }
        const window = new Window({ parent: this, appName: this.name, ...options });
        this.windows.push(window);
        this.manager.windowStatus.push(window.status);

        // if (options.component) {
        //     this.component = createApp(options.component);
        //     this.component.mount(window.dom);
        // }

        return window;
    }

    closeWindow (window: Window) {
        this.status.firstWindowOpen = false;
        this.windows.splice(this.windows.indexOf(window), 1);

        this.manager.removeWindowStatus(window);
        this.component?.unmount();
        window.removeUI();

        if (this.windows.length === 0 && !this.canBackground) {
            this.quit();
        }
    }

    quit () {
        this.manager.leaveApp(this);
    }
}