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
import { AppNames, appNameToTitle, createEmptyStatus } from './app-config';
import type { AppManager } from './app-manager';
import type { IApp, IAppMessageBase, IAppMessage, IAppStatusTitle } from './type';
import type { Ref } from 'vue';
import { markRaw, type App as VueApp } from 'vue';
import { cache, handleComponent, appIcon, upcaseFirstLetter } from '@/lib/utils';
import type { ISelectItem } from '../types/component';
import { useGlobalStore } from '@/ui/store';
import { createDockAppMenuList } from '../../ui/components/common/context-menu/context-menu';

export enum AppType {
    Normal,
    Web,
    Link,
}

export interface IAppOptions {
    name?: string;
    icon?: string;
    iconRadius?: number;
    iconScale?: number|boolean;
    title?: string;
    link?: string;
    msgCount?: number;
    onMessage?: (data: IAppMessage) => void;
    appType?: AppType;
    statusMenu?: IAppStatusTitle[]; // 顶部 status bar的标题和菜单
}
export class App<This extends App = App<any>> implements IApp {
    proxy: ()=>This;
    isVirtualApp = false;
    name: string;
    icon: string;
    iconRadius: string;
    component?: VueApp;
    defCaptureSrc = '';
    title: string;
    manager: AppManager;
    link: string;
    iconScale: number;
    msgCount: number; // 小红点数量
    onMessage?: (data: IAppMessage) => void;

    windows: Window[] = [];

    isRunning = false;

    canBackground = false;
    appType: AppType;

    newWindowOptions: IWindowOptions|null = null;

    firstWindowOpen?: boolean; // 用于显示docker动画
    dockMenu: ISelectItem[]; // dock 的标题和菜单
    statusMenu: IAppStatusTitle[]; // 顶部 status bar的标题和菜单
    constructor ({
        name = '',
        icon = '',
        iconRadius = 0.25,
        iconScale = 1,
        title = '',
        onMessage,
        link = '',
        msgCount = 0,
        appType = AppType.Normal,
    }: IAppOptions) {
        this.link = link;
        if (link) appType = AppType.Link;
        this.name = name;
        this.msgCount = msgCount;
        this.appType = appType;

        this.manager = OS.instance.appManager;
        this.icon = icon || appIcon(name);
        this.iconRadius = iconRadius < 1 ? `${iconRadius * 100}%` : `${iconRadius}px`;
        this.title = title || appNameToTitle(name);
        this.iconScale = typeof iconScale === 'number' ? iconScale : (iconScale ? 1.22 : 1);
        this.onMessage = onMessage;

        MacEvent.on('app-message', (data) => {
            if (this.onMessage && data.to === this.name) {
                this.onMessage(data);
            }
        });

        if (!this.statusMenu) {
            this.statusMenu = createEmptyStatus(upcaseFirstLetter(this.name));
        }
        if (!this.dockMenu) {
            this.dockMenu = createDockAppMenuList(this);
        }
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

    private _initAppStatus () {
        this.manager.currentApp = this;
        if (this.name === AppNames.trash) {
            useGlobalStore().statusMenu = this.manager.finder.statusMenu;
        } else if (!this.isVirtualApp) {
            useGlobalStore().statusMenu = this.statusMenu;
        }
    }

    onOpen (): Window|null|void {
        this._initAppStatus();
        if (this.link) {
            window.open(this.link);
        } else {
            const win = this.findLatestWindow();
            if (!win) {
                if (this.newWindowOptions) {
                    return this.openNewWindow();
                } else {
                    // todo
                    toast({
                        from: this,
                        content: 'under development...'
                    });
                }
            } else {
                win.status.$bringToTop();
                return win;
            }
        }
        return null;
    }

    findLatestWindow () {
        if (!this.windows.length) return null;

        let maxZIndex = -1;
        let index = -1;

        this.windows.forEach((item, i) => {
            const zIndex = item.status.zIndex;
            if (zIndex > maxZIndex) {
                index = i;
                maxZIndex = zIndex;
            }
        });
        return this.windows[index];
    }

    initStatusBar () {

    }

    openNewWindow (options?: IWindowOptions) {
        if (typeof options === 'undefined') {
            options = (this.newWindowOptions || {
                header: {},
                events: {}
            }) as IWindowOptions;
        }
        this.firstWindowOpen = this.windows.length === 0;
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
        this.firstWindowOpen = false;
        this.windows.splice(this.windows.indexOf(window), 1);

        this.manager.removeWindowStatus(window);
        this.component?.unmount();
        window.removeUI();

        if (this.windows.length === 0 && !this.canBackground) {
            // console.log(`app ${this.name} quit`);
            this.manager.leaveApp(this);
        }
    }

    closeApp () {
        const n = this.windows.length;
        for (let i = n; i > 0; i--) {
            this.windows[i - 1].close();
        }
    }

    hide () {
        this.windows.forEach(win => {
            win.status.visible = false;
        });
    }

    showAllWindows () {
        this.windows.forEach(win => {
            win.status.$bringToTop();
            win.status.visible = true;
        });
    }
}