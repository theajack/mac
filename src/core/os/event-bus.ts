/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:09:10
 * @Description: Coding something
 */
import event from 'tc-event';
import { IAppMessage } from '../apps/type';
import { Event } from '../enum';

export const ApiSymbol = Symbol('api');

export const AppEventModule = event.createModule('app');

export function sendMessageToApp ({
    from = ApiSymbol,
    to,
    data
}: IAppMessage) {
    AppEventModule.emit(Event.AppMessage, {
        from,
        to,
        data,
    });
}