/*
 * @Author: chenzhongsheng
 * @Date: 2023-02-12 22:10:05
 * @Description: Coding something
 */
import { buildTransform, createDockAnimation } from '@/ui/lib/animation/dock-anim';
import { reactive } from 'vue';
import type { ISize } from '../../type';
import type { Window } from './window';

let captureIndex = 0;

interface ICaptureStyle {
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    scaleOffsetX: number;
}

export class WindowCapture {
    static List: WindowCapture[] = reactive([]);
    id: number;
    icon: string;
    title: string;
    appIcon: string;
    window: Window;
    inited = false;
    captureStyle: ICaptureStyle;

    static LEN = 45;
    constructor (window: Window) {
        this.id = captureIndex++;
        this.window = window;
        const parent = window.parent;
        this.icon = parent.defCaptureSrc || parent.icon;
        this.title = parent.name;
        this.appIcon = parent.icon;
        WindowCapture.List.push(this);
        this.init(window);


        this.startCaptureAnimation();
    }

    private _windowDom: HTMLElement;

    get windowDom () {
        if (this._windowDom) return this._windowDom;
        const parent = this.window.dom.parentElement;
        if (!parent) throw new Error('parent not exist');
        this._windowDom = parent;
        return parent;
    }

    private _resumeAnimation: (x: number, complete?:()=>void) => void;

    private startCaptureAnimation () {

        const parent = this.windowDom;

        const { x, y, height, width } = parent.getBoundingClientRect();

        this.captureStyle = WindowCapture.countCaptureStyle({ width, height });

        const { x: CX, y: CY, scaleX, scaleY } = this.captureStyle;

        this._resumeAnimation = createDockAnimation(
            parent,
            { x, y, scaleX: 100, scaleY: 100, zIndex: this.window.status.zIndex },
            { x: CX, y: CY, scaleX, scaleY, zIndex: 100 },
            { width, height },
            () => {
                // this.status.visible = false;
                this.addIntoCapture();
            }
        );
        setTimeout(() => {
            this.parentDom.classList.add('animation');
        }, 0);
    }
    private _captureDom: Element;
    get captureDom () {
        if (!this._captureDom) {
            const list = document.querySelectorAll('.dock-capture');
            this._captureDom = list[list.length - 1];
        }
        return this._captureDom;
    }

    get parentDom () {
        if (!this.captureDom.parentElement) throw new Error('capture is not Mounted!');
        return this.captureDom.parentElement;
    }

    addIntoCapture () {
        const { offsetX, offsetY, scaleX, scaleY } = this.captureStyle;

        this.windowDom.style.position = 'absolute';
        this.windowDom.style.transform = buildTransform({
            x: offsetX,
            y: offsetY,
            scaleX,
            scaleY,
            skew: 0,
        });
        this.captureDom.appendChild(this.windowDom);
    }

    resumeWindow () {

        const el = document.querySelector('.desktop-container');

        if (!el) return;

        const { y, scaleX, scaleY, scaleOffsetX } = this.captureStyle;

        const { x: rectX } = this.captureDom.getBoundingClientRect();

        this.windowDom.style.position = 'fixed';

        const resumeX = rectX + scaleOffsetX;
        this.windowDom.style.transform = buildTransform({
            x: resumeX,
            y,
            scaleX,
            scaleY,
            skew: 0,
        });

        el.appendChild(this.windowDom);

        setTimeout(() => {
            this.parentDom.classList.remove('animation');
            this._resumeAnimation(resumeX, () => {
                console.log('resume done');
                this.remove();
            });
        }, 0);
    }

    static countCaptureStyle ({ width, height }: ISize): ICaptureStyle {

        const holder = document.getElementById('CapturePlaceHolder');

        if (!holder) throw new Error('CapturePlaceHolder not exist');

        const targetLen = WindowCapture.LEN;

        const scale = targetLen / Math.max(height, width);

        const { x, y } = holder.getBoundingClientRect();

        const targetHeight = height * scale;
        const targetWidth = width * scale;

        const scaleOffsetX = (targetWidth - width) / 2;

        const offsetX = (targetLen - targetWidth) / 2
            + scaleOffsetX; // (targetLen + 12) / 2 为居中导致往左偏移了 len + margin的一半
        const offsetY = (targetLen - targetHeight) / 2
            - (height - targetHeight) / 2;

        const targetX = x + offsetX - (targetLen + 12) / 2;

        const targetY = y + offsetY;

        console.log(offsetX, offsetY);

        return {
            offsetX,
            offsetY,
            x: targetX,
            y: targetY,
            scaleX: scale * 100,
            scaleY: scale * 100,
            scaleOffsetX,
        };
    }

    async init (window: Window) {
        // this.icon = canvas.toDataURL();
        const _thisProxy = WindowCapture.List.find(item => item.id === this.id);
        if (_thisProxy) {
            // const url = await window.capture();
            // _thisProxy.icon = url;
            // // 修改默认快照
            // window.parent.defCaptureSrc = url;
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
