/*
 * @Author: tackchen
 * @Date: 2022-09-05 19:46:58
 * @Description: Coding something
 */
import { Event } from '@core/enum';
import { AppEventModule, sendMessageToApp } from '@core/os/event-bus';
import { Window } from '@core/os/window';
import { IAppStatus, IApp, IAppMessageBase, IAppMessage } from './type';
export class App implements IApp {
    name: string;
    status: IAppStatus;
    onMessage?: (data: IAppMessage) => void;

    windows: Window[] = [];

    constructor ({
        name,
        status,
        onMessage
    }: {
        name: string;
        status: IAppStatus
        onMessage?: (data: IAppMessage) => void;
    }) {
        this.name = name;
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
}