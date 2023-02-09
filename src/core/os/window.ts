/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:39:58
 * @Description: Coding something
 */

import { toastText } from '@/ui/components/common/toast/toast';
import { reactive } from 'vue';
import { IJson } from 'webos-term';
import { App } from '../apps/app';
import html2canvas from 'html2canvas';

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

let captureIndex = 0;

export class WindowCapture {
    static List: WindowCapture[] = reactive([]);
    id: number;
    icon: string;
    title: string;
    appIcon: string;
    window: Window;
    inited = false;
    constructor (window: Window) {
        this.id = captureIndex++;
        this.window = window;
        const parent = window.parent;
        this.icon = parent.defCaptureSrc || parent.icon;
        this.title = parent.name;
        this.appIcon = parent.icon;
        WindowCapture.List.push(this);
        this.init(window);
    }

    async init (window: Window) {
        // this.icon = canvas.toDataURL();
        const _thisProxy = WindowCapture.List.find(item => item.id === this.id);
        if (_thisProxy) {
            const url = await window.capture();
            _thisProxy.icon = url;
            // 修改默认快照
            window.parent.defCaptureSrc = url;
            _thisProxy.inited = true;
        }
    }

    remove () {
        WindowCapture.List.splice(
            WindowCapture.List.indexOf(this),
            1
        );
    }
}

window.WindowCapture = WindowCapture;

export class Window {
    id: number;

    status: IWindowStatus;

    parent: App;

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

    async capture () {
        const canvas = await html2canvas(this.dom);
        return canvas.toDataURL();
    }

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
        this.status.visible = false;
        new WindowCapture(this);
    }

    resume () {
        this.status.visible = true;
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