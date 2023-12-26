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

export class App implements IApp {
    name: string;
    icon: string;
    component?: VueApp;
    defCaptureSrc = '';
    title: string;
    status: IAppStatus;
    manager: AppManager;
    onMessage?: (data: IAppMessage) => void;

    windows: Window[] = [];

    isRunning = false;

    canBackground = false;

    constructor ({
        name = '',
        icon = '',
        title = '',
        status = {} as any,
        onMessage,
    }: {
        name?: string;
        icon?: string;
        title?: string;
        status?: IAppStatus;
        onMessage?: (data: IAppMessage) => void;
    }) {
        this.name = name;
        this.manager = OS.instance.appManager;
        this.icon = icon || resource(`icons/${name}.png`);
        this.title = title || appNameToTitle(name);
        this.status = status;
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
        toast({
            from: this,
            content: 'under development...'
        });

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