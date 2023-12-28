import { MenuHeight } from '@/ui/style/common';
import type { Ref } from 'vue';
import { onMounted, onUnmounted } from 'vue';
import type { Ele } from 'easy-dom-util';
import $ from 'easy-dom-util';
import type { IJson } from '@/types';
import type { IWindowStatus } from '@/core/os/window/window';
import { useGlobalStore } from '@/ui/store';

export function initWindow (
    domRef: Ref<HTMLElement>,
    status: IWindowStatus,
    handleParent: (el: HTMLElement) => HTMLElement = e => e.parentElement || e
) {

    let parent: HTMLElement;
    let target: HTMLElement;

    const { initEvents, clearEvents } = initDrag(status);

    onMounted(() => {
        target = domRef.value;
        parent = handleParent(target);
        initEvents(target, parent);
        if (status.enableResize) {
            initWindowResize(parent, status);
        }
    });

    onUnmounted(() => {
        clearEvents();
    });
}

function createOffset (id: number) {
    const size = id % 10;
    return 12 * size;
}

function initDrag (status: IWindowStatus) {
    console.log('initDrag', status.id);
    const store = useGlobalStore();

    let left = 0;
    let top = 0;

    let parent: HTMLElement;
    let target: HTMLElement;

    let isMouseDown = false;

    let offsetX = 0;
    let offsetY = 0;

    const setTransform = (left: number, top: number) => {
        status.x = left;
        status.y = top;
        status.isMax = false;
    };

    const modifyPos = (e: MouseEvent) => {
        left = e.clientX - offsetX;
        top = e.clientY - offsetY;
        if (top < MenuHeight) top = MenuHeight;
        setTransform(left, top);
    };

    const clearMouseDown = () => {
        if (!isMouseDown) return;
        store.drag(false);
        isMouseDown = false;
    };

    function onMouseMove (e: MouseEvent) {
        if (!isMouseDown) return;
        modifyPos(e);
    }

    function onMouseDown (e: MouseEvent) {
        store.drag();
        isMouseDown = true;
        const { left, top } = target.getBoundingClientRect();
        offsetX = e.clientX - left;
        offsetY = e.clientY - top;
    }

    function initPosition () {
        const { x, y } = parent.getBoundingClientRect();
        const offset = createOffset(status.appWinId);
        setTransform(x + offset, y + offset);
        status.inited = true;
    }

    return {

        initEvents (_t: HTMLElement, _p: HTMLElement) {
            target = _t;
            parent = _p;

            target.addEventListener('mousedown', onMouseDown, false);
            window.addEventListener('mousemove', onMouseMove, false);
            target.addEventListener('mouseup', clearMouseDown, false);
            window.addEventListener('mouseup', clearMouseDown, false);

            setTimeout(() => {
                // ! 等待dom高度有值，否在在auto时会导致位置不对
                initPosition();
            }, 50);
        },
        clearEvents () {
            target.removeEventListener('mousedown', onMouseDown, false);
            window.removeEventListener('mousemove', onMouseMove, false);
            target.removeEventListener('mouseup', clearMouseDown, false);
            window.removeEventListener('mouseup', clearMouseDown, false);
        }
    };
}

function createEdge (
    status: IWindowStatus,
    style: IJson,
    onresize: (x: number, y: number)=>void
): Ele {
    const store = useGlobalStore();
    const el = ($.create('div')
        .cls('window-edge') as Ele)
        .style(style) as Ele;
    let isMouseDown = false;
    el.on({
        mousedown: () => {
            isMouseDown = true;
            store.drag();
            document.body.style.cursor = style.cursor;
        },
        mouseup: () => {
            isMouseDown = false;
            document.body.style.cursor = 'auto';
        },
    });

    const moveHandler = (e: MouseEvent) => {
        if (!isMouseDown) return;
        status.isMax = false; // ! 清空isMax状态
        onresize(e.clientX, e.clientY);
    };
    const upHandler = () => {
        if (!isMouseDown) return;
        isMouseDown = false;
        store.drag(false);
        document.body.style.cursor = 'auto';
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
    status.clearList.push(() => {
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', upHandler);
    });

    return el;
}


function initWindowResize (parent: HTMLElement, status: IWindowStatus) {

    const MIN_SIZE = 200;

    const formatHeight = () => {if (typeof status.height === 'string') { status.height = parent.offsetHeight;}};

    const formatWidth = () => {if (typeof status.width === 'string') { status.width = parent.offsetWidth;}};


    const topResize = (x: number, y: number) => {
        if (y < MenuHeight) y = MenuHeight;
        const prevY = status.y;
        formatHeight();
        // @ts-ignore
        const newValue = status.height + (prevY - y);
        if (newValue < MIN_SIZE) return;
        status.height = newValue;
        status.y = y;
    };

    const rightResize = (x: number) => {
        formatWidth();
        const newValue = (x - status.x);
        if (newValue < MIN_SIZE) return;
        status.width = newValue;
    };

    const bottomResize = (x: number, y: number) => {
        formatHeight();
        const newValue = (y - status.y);
        if (newValue < MIN_SIZE) return;
        status.height = newValue;
    };

    const leftResize = (x: number) => {
        const prevX = status.x;
        formatWidth();
        // @ts-ignore
        const newValue = status.width + (prevX - x);
        if (newValue < MIN_SIZE) return;
        status.width = newValue;
        status.x = x;
    };

    const edgeConfig: IJson<{
        style: IJson,
        onresize(x: number, y: number): void;
    }> = {
        'top': {
            style: { width: '100%', cursor: 'ns-resize', left: 0, top: 0, },
            onresize: topResize
        },
        'right': {
            style: { height: '100%', cursor: 'ew-resize', right: 0, top: 0 },
            onresize: rightResize
        },
        'bottom': {
            style: { width: '100%', cursor: 'ns-resize', left: 0, bottom: 0 },
            onresize: bottomResize
        },
        'left': {
            style: { height: '100%', cursor: 'ew-resize', left: 0, top: 0 },
            onresize: leftResize
        },
        'l_t': {
            style: { cursor: 'nwse-resize', left: 0, top: 0 },
            onresize: (x, y) => {
                leftResize(x);
                topResize(x, y);
            } },
        'r_t': {
            style: { cursor: 'nesw-resize', right: 0, top: 0 },
            onresize: (x, y) => {
                rightResize(x);
                topResize(x, y);
            } },
        'r_b': {
            style: { cursor: 'nwse-resize', right: 0, bottom: 0 },
            onresize: (x, y) => {
                rightResize(x);
                bottomResize(x, y);
            } },
        'l_b': {
            style: { cursor: 'nesw-resize', left: 0, bottom: 0 },
            onresize: (x, y) => {
                leftResize(x);
                bottomResize(x, y);
            }
        },
    };

    // @ts-ignore
    const children = Object.keys(edgeConfig).map(key => {
        const { style, onresize } = edgeConfig[key];
        return createEdge(status, style, onresize);
    });

    // @ts-ignore
    $.query(parent).append(children);


    // 左右缩放 ew-resize
    // 上下缩放 ns-resize
    // 右上 左下 nesw-resize
    // 左上 右下 nwse-resize
}