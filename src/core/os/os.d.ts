/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:29:25
 * @Description: Coding something
 */

import { IEventRegistOption, IEventListener, IListenerItem } from 'tc-event';
import { Event } from '../enum';
import { IAppMessage } from '../apps/type';

type TEventListener<T=any> = (data: T, listenOption: {
    firstEmit: boolean;
    item: IListenerItem;
    remove: () => boolean;
    clear: () => boolean;
  }) => void;

// todo 当有新事件加入时 请在下面加入声明
interface IEventMap { // EEvent
    [Event.AppMessage]: IAppMessage;
}


export type TGameEventEmitter =
    <Key extends keyof IEventMap>(eventName: Key | string, data?: IEventMap[Key]) => boolean;

type TRegistObject = {
    [key in keyof IEventMap]?: TEventListener<IEventMap[key]>;
};
declare module 'tc-event' {
    interface IRegistMethod {
        // eslint-disable-next-line @typescript-eslint/prefer-function-type
        <Key extends keyof IEventMap>(eventName: Key, listener: TEventListener<IEventMap[Key]>): IListenerItem;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IRegistObject extends TRegistObject {
        [key: string]: IEventListener | IEventRegistOption;
    }
}