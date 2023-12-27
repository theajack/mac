/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:09:10
 * @Description: Coding something
 */
import Eveit from 'eveit';
import type { IAppMessage } from '../apps/type';
import type { OS } from './os';
import type { AppNames } from '../apps/app-config';
import type { ITabItem } from '../apps/built-in/safari/safari-store';


export const ApiSymbol = Symbol('api');
// todo 当有新事件加入时 请在下面加入声明
// @ts-ignore
export const MacEvent = new Eveit<{ // EEvent
    'app-message': [IAppMessage];
    'os-inited': [OS];
    'new-window': [{name: AppNames, data: ITabItem}],
    // 'new-window': [{name: AppNames, data: ITabItem, iframe: HTMLIFrameElement}],
}>();

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