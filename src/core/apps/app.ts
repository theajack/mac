/*
 * @Author: tackchen
 * @Date: 2022-09-05 19:46:58
 * @Description: Coding something
 */
import { toast } from '@/ui/components/common/toast/toast';
import { Event } from '@core/enum';
import { AppEventModule, sendMessageToApp } from '@core/os/event-bus';
import { Window } from '@core/os/window';
import { nextTick } from 'vue';
import { OS } from '../os/os';
import { appNameToTitle } from './app-config';
import { AppManager } from './app-manager';
import { IAppStatus, IApp, IAppMessageBase, IAppMessage } from './type';

export class App implements IApp {
    name: string;
    icon: string;
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
        this.icon = icon || `/mac/assets/icons/${name}.png`;
        this.title = title || appNameToTitle(name);
        this.status = status;
        this.onMessage = onMessage;

        AppEventModule.regist(Event.AppMessage, (data) => {
            if (this.onMessage && data.to === this.name) {
                this.onMessage(data);
            }
        });
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
            content: 'In developing...'
        });

    }

    initStatusBar () {

    }

    openNewWindow () {
        if (!this.isRunning) {
            this.manager.enterApp(this);
        }
        const window = new Window({ parent: this });
        this.windows.push(window);
        this.manager.windowStatus.push(window.status);

        if (!this.defCaptureSrc) {
            setTimeout(() => { // 等待元素渲染好
                window.capture().then(url => {
                    this.defCaptureSrc = url;
                });
            }, 50);
        }

        return window;
    }

    closeWindow (window: Window) {
        this.windows.splice(this.windows.indexOf(window), 1);

        this.manager.removeWindowStatus(window);

        window.removeUI();

        if (this.windows.length === 0 && !this.canBackground) {
            this.quit();
        }
    }

    quit () {
        this.manager.leaveApp(this);
    }
}