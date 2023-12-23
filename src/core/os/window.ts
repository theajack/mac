/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:39:58
 * @Description: Coding something
 */

import { toastText } from '@/ui/components/common/toast/toast';
import { reactive } from 'vue';
import type { IJson } from 'webos-term';
import type { App } from '../apps/app';
// import html2canvas from 'html2canvas';
import { WindowCapture } from './window-capture';
import { WindowHeight, WindowWidth } from '@/ui/style/common';
import { transformSize } from '@/lib/utils';

export interface IHeaderBtnStatus {
    active?: boolean;
    disabled?: boolean;
}

export type IHeaderBtns = {
    gap: number;
} & {
    [key in 'close' | 'min' | 'full']: IHeaderBtnStatus;
};

export interface IWindowOptions {
    title?: string,
    events: IJson<()=>void>,
    buttons?: Partial<IHeaderBtns>;
    width?: number|'auto',
    height?: number|'auto',
    headerBgColor?: string,
}

export class WindowHeader {
    buttons: IHeaderBtns;
    title = 'Window';
    id = 0;
    events: IJson<()=>void>;
    background = '';

    constructor ({
        id,
        events,
        buttons = {},
        title = 'Window',
        headerBgColor = '#38343c',
    }: {
        id: number,
    } & IWindowOptions) {
        this.title = title,
        this.id = id;
        this.events = events || {};
        this.background = headerBgColor;

        this.buttons = Object.assign({
            min: {},
            close: {},
            full: {},
            gap: 10,
        }, buttons);
    }
}

let idIndex = 0;

export interface IWindowStatus {
    id: number;
    zIndex: number;
    isOnTop: boolean;
    status: 'min' | 'full' | 'normal';
    isFullscreen: boolean;
    header: WindowHeader;
    visible: boolean;
    events: IJson<()=>void>;
    width: number,
    height: number,
}

export function createWindowStatus (header: IWindowOptions): IWindowStatus {
    const id = idIndex ++;
    return {
        isFullscreen: false,
        id: id,
        zIndex: 0,
        isOnTop: true,
        status: 'normal',
        visible: true,
        width: transformSize(WindowWidth, header.width),
        height: transformSize(WindowHeight, header.height),
        events: header.events,
        header: new WindowHeader(Object.assign(header, { id })),
    };
}

export class Window {
    id: number;

    status: IWindowStatus;

    parent: App;

    capture: WindowCapture;

    captureDom: HTMLElement;

    private _dom: HTMLElement;

    constructor (options: {
        parent: App;
    } & Partial<IWindowOptions>) {
        this.status = reactive(createWindowStatus(Object.assign({
            events: {
                closeWindow: () => this.close(),
                minimize: () => this.minimize(),
                maximize: () => this.maximize()
            },
        }, options)));
        this.id = this.status.id;
        this.parent = options.parent;
    }

    // async capture () {
    //     const canvas = await html2canvas(this.dom);
    //     return canvas.toDataURL();
    // }

    close () {
        this.parent.closeWindow(this);
    }

    removeUI () {
        // console.log('close');
    }

    maximize () {
        console.log('maximize');
        toastText('in developing');
    }

    minimize () {
        console.log('minimize');
        this.capture = new WindowCapture(this);
    }

    resume () {
        this.capture.resumeWindow();
    }

    get dom () {
        if (!this._dom) {
            const dom = document.getElementById(`WINDOW_DOM_${this.status.id}`);
            if (!dom) throw new Error('Connect find dom');
            this._dom = dom;
        }
        return this._dom;
    }
}