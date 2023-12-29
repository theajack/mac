/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:39:58
 * @Description: Coding something
 */

// import { underDevelopment } from '@/ui/components/common/toast/toast';
import { nextTick, reactive } from 'vue';
import type { App } from '../../apps/app';
// import html2canvas from 'html2canvas';
import { WindowCapture } from './window-capture';
import { WindowHeight, WindowWidth } from '@/ui/style/common';
import { transformSize } from '@/lib/utils';
import type { IWindowHeaderOptions } from './window-header';
import { WindowHeader } from './window-header';
import type { WindowSizeStatus } from '@/core/enum';
import { useGlobalStore } from '@/ui/store';
import type { IJson } from '@/core/type';

export interface IWindowOptions {
    events?: IJson<()=>void>, // header 按钮的事件
    enableResize?: boolean;
    width?: number|'auto',
    height?: number|'auto',
    header?: IWindowHeaderOptions,
    component?: any,
    singleMode?: boolean,
    appName?: string,
    url?: string,
    background?: string,
}

const createWinIds = (() => {

    let idIndex = 0;
    const map: Record<string, number> = {} as any;

    return (name = '$default') => {
        if (typeof map[name] === 'number') {
            map[name] ++;
        } else {
            map[name] = 0;
        }
        return [ idIndex++, map[name] ];
    };
})();

function countSize (width?: number|string, height?: number|string) {
    const defRate = 0.8;

    const relHeight = transformSize(WindowHeight, height, defRate);

    let refHeight = 0;

    if (typeof relHeight === 'string') {
        if (relHeight.includes('px')) {
            refHeight = parseInt(relHeight.replace('px', ''));
        } else if (relHeight.includes('%')) {
            refHeight = (parseFloat(relHeight.replace('%', '')) / 100) * WindowHeight;
        } else {
            refHeight = WindowHeight * defRate;
        }
    } else {
        refHeight = relHeight;
    }
    const relWidth = typeof width !== 'undefined' ?
        transformSize(WindowWidth, width, defRate) :
        transformSize(refHeight, width, 1920 / 1080);
    return [ relWidth, relHeight ];
}


export function createWindowStatus (
    options: IWindowOptions,
) {
    const [ id, appWinId ] = createWinIds(options.appName);

    const [ width, height ] = countSize(options.width, options.height);

    return {
        isFullscreen: false,
        isMax: false,
        id,
        appWinId, // 当前app内的id
        appName: options.appName,
        zIndex: ++useGlobalStore().windowMaxZIndex,
        isOnTop: true,
        status: 'normal' as WindowSizeStatus,
        visible: true,
        width,
        height,
        events: options.events,
        header: new WindowHeader(Object.assign(options.header || {}, { id })),
        enableResize: options.enableResize ?? true,
        x: 0,
        y: 0,
        inited: false,
        component: options.component,
        singleMode: options.singleMode ?? false,
        url: options.url,
        transform () {
            return this.inited ?
                `translate(${this.x}px, ${this.y}px)` :
                `translate(-50%, -50%)`;
        },
        clearList: [] as (()=>void)[],
        animation: false,
        background: options.background,
        _timer: null as any,
        async $animate (fn: ()=>void) {
            clearTimeout(this._timer);
            this.animation = true;
            await nextTick();
            fn();
            this._timer = setTimeout(() => {
                this.animation = false;
            }, 310);
        },
    };
}
export type IWindowStatus = ReturnType<typeof createWindowStatus>;

export class Window {
    id: number;

    status: IWindowStatus;

    parent: App;

    capture: WindowCapture;

    captureDom: HTMLElement;

    private _dom: HTMLElement;

    constructor (options: {
        parent: App;
    } & IWindowOptions) {
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
        // underDevelopment();
        // 先使用fullwindow代替

    }

    private prevSize: any = null;


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