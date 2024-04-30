/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:09:10
 * @Description: Coding something
 */
import Eveit from 'eveit';
import type { IAppMessage } from '../apps/type';
import type { OS } from './os';
import type { AppNames } from '../apps/app-config';
import type { IJson } from 'webos-term';
import type { App } from '../apps/app';

export const ApiSymbol = Symbol('api');
// todo 当有新事件加入时 请在下面加入声明
// @ts-ignore
export const MacEvent = new Eveit<{ // EEvent
    'app-message': [IAppMessage];
    'os-inited': [OS];
    'call-app': [ICallAppInfo],
    'current-window-change': []
    // 'call-app': [{name: AppNames, data: ITabItem, iframe: HTMLIFrameElement}],
}>();

export interface ICallAppInfo {name: AppNames, from?: App, data: IJson}

MacEvent.usePrevEmit = true;

export function sendMessageToApp ({
    from = ApiSymbol,
    to,
    data
}: IAppMessage) {
    MacEvent.emit('app-message', {
        from,
        to,
        data,
    });
}

export function refreshCurrentWindow () {
    MacEvent.emit('current-window-change');
}