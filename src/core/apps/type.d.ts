/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:11:26
 * @Description: Coding something
 */

import type { ISelectItem } from '../types/component';

export interface IApp {
    name: string;
    isRunning: boolean;
}

export interface IAppStatusTitle {
    title?: string;
    children: ISelectItem[];
}

export interface IAppMessageBase {
    to: string;
    data: any;
}

export interface IAppMessage extends IAppMessageBase {
    from?: symbol | string;
}
