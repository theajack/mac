/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:39:58
 * @Description: Coding something
 */

import { toastText } from '@/ui/components/common/toast/toast';
import { reactive } from 'vue';
import { IJson } from 'webos-term';
import { App } from '../apps/app';
// import html2canvas from 'html2canvas';
import { WindowCapture } from './window-capture';

export class WindowHeader {
    buttons: {
        gap: number;
    } & {
        [key in 'close' | 'min' | 'full']: {
            active?: boolean;
            disabled?: boolean;
        }
    };
    title = 'Title';
    id = 0;
    events: IJson<()=>void>;

    constructor (id: number, events: IJson<()=>void>) {
        this.id = id;
        this.events = events;
        this.buttons = {
            min: {},
            close: {},
            full: {},
            gap: 10,
        };
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
    events: IJson<()=>void>
}

export function createWindowStatus (events: IJson<()=>void>): IWindowStatus {
    const id = idIndex ++;
    return {
        isFullscreen: false,
        id: id,
        zIndex: 0,
        isOnTop: true,
        status: 'normal',
        visible: true,
        events,
        header: new WindowHeader(id, events),
    };
}

export class Window {
    id: number;

    status: IWindowStatus;

    parent: App;

    capture: WindowCapture;

    captureDom: HTMLElement;

    private _dom: HTMLElement;

    constructor ({
        parent,
    }: {
        headerGap?: number;
        parent: App;
    }) {
        this.status = reactive(createWindowStatus({
            closeWindow: () => this.close(),
            minimize: () => this.minimize(),
            maximize: () => this.maximize()
        }));
        this.id = this.status.id;
        this.parent = parent;
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