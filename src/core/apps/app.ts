/*
 * @Author: tackchen
 * @Date: 2022-09-05 19:46:58
 * @Description: Coding something
 */
import { toast } from '@/ui/components/common/toast/toast';
import { Event } from '@core/enum';
import { AppEventModule, sendMessageToApp } from '@core/os/event-bus';
import { Window } from '@core/os/window';
import { appNameToTitle } from './app-config';
import { IAppStatus, IApp, IAppMessageBase, IAppMessage } from './type';
export class App implements IApp {
    name: string;
    icon: string;
    title: string;
    status: IAppStatus;
    isOpen = true;
    onMessage?: (data: IAppMessage) => void;

    windows: Window[] = [];

    constructor ({
        name = '',
        icon = '',
        title = '',
        status = {} as any,
        onMessage
    }: {
        name?: string;
        icon?: string;
        title?: string;
        status?: IAppStatus
        onMessage?: (data: IAppMessage) => void;
    } = {}) {
        this.name = name;
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
}