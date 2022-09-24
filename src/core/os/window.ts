/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:39:58
 * @Description: Coding something
 */

import { IApp } from '../apps/type';

export class WindowHeader {
    buttons: {
        gap: number;

    } & {
        [key in 'close' | 'min' | 'full']: {
            active?: boolean;
            disabled?: boolean;
        }
    };
    parent: Window;

    constructor ({
        gap,
        parent
    }: {
        gap: number;
        parent: Window;
    }) {
        this.buttons = {
            min: {},
            close: {},
            full: {},
            gap,
        };
        this.parent = parent;
    }
}

export class Window {
    header: WindowHeader;
    zIndex: number;
    isOnTop: boolean;
    status: 'min' | 'full' | 'normal';

    parent: IApp;

    constructor ({
        headerGap,
        parent,
    }: {
        headerGap: number;
        parent: IApp;
    }) {
        this.header = new WindowHeader({
            gap: headerGap,
            parent: this,
        });
        this.parent = parent;
    }

    close () {
        console.log('close');
    }

    maximize () {
        console.log('maximize');
    }

    minimize () {
        console.log('minimize');
    }


}