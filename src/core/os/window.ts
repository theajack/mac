/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:39:58
 * @Description: Coding something
 */

import { App } from '../apps/app';

export class WindowHeader {
    buttons: {
        gap: number;
    } & {
        [key in 'close' | 'min' | 'full']: {
            active?: boolean;
            disabled?: boolean;
        }
    };

    constructor () {
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
}

export function createWindowStatus (): IWindowStatus {
    return {
        isFullscreen: false,
        id: idIndex ++,
        zIndex: 0,
        isOnTop: true,
        status: 'normal',
        header: new WindowHeader(),
    };
}


export class Window {

    status: IWindowStatus;

    parent: App;

    private _dom: HTMLElement;

    constructor ({
        parent,
    }: {
        headerGap?: number;
        parent: App;
    }) {
        this.status = createWindowStatus();
        this.parent = parent;
    }

    close () {
        this.parent.closeWindow(this);
    }

    removeUI () {
        console.log('close');
    }

    maximize () {
        console.log('maximize');
    }

    minimize () {
        console.log('minimize');
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