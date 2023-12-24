/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-24 09:18:55
 * @Description: Coding something
 */

import type { IJson } from '@/core/type';

export interface IHeaderBtnStatus {
    active?: boolean;
    disabled?: boolean;
}

export type IHeaderBtns = {
    gap: number;
} & {
    [key in 'close' | 'min' | 'full']: IHeaderBtnStatus;
};

export interface IWindowHeaderOptions {
    title?: string,
    events: IJson<()=>void>, // header 按钮的事件
    buttons?: Partial<IHeaderBtns>;
    width?: number|'auto',
    height?: number|'auto',
    headerBgColor?: string,
}

export class WindowHeader {
    id = 0;
    title = 'Window';
    events: IJson<()=>void>;
    buttons: IHeaderBtns;
    headerBgColor = '';
    canResize: boolean;

    constructor ({
        id,
        events,
        buttons = {},
        title = 'Window',
        headerBgColor = '#38343c88',
    }: {
        id: number,
    } & IWindowHeaderOptions) {
        this.title = title,
        this.id = id;
        this.events = events || {};
        this.headerBgColor = headerBgColor;

        this.buttons = Object.assign({
            min: {},
            close: {},
            full: {},
            gap: 10,
        }, buttons);
    }
}