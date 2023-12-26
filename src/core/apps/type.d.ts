/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:11:26
 * @Description: Coding something
 */

import type { ISelectItem } from '../types/component';

export interface IApp {
    name: string;
    status: IAppStatus;
    isRunning: boolean;
}

export interface IAppStatusTitle {
    title?: string;
    children: ISelectItem[];
}

export interface IAppStatus {
    firstWindowOpen?: boolean; // 用于显示docker动画
    dock: IAppStatusTitle;
    center?: IAppStatusTitle;
    list: IAppStatusTitle[];
}

export interface IAppMessageBase {
    to: string;
    data: any;
}

export interface IAppMessage extends IAppMessageBase {
    from?: symbol | string;
}
