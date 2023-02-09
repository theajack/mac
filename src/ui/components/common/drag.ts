import { MenuHeight } from '@/ui/style/common';
import { onMounted, Ref, onUnmounted } from 'vue';
import $, { Ele } from 'easy-dom-util';
import { IJson } from '@/types';

export function initWindow (
    domRef: Ref<HTMLElement>,
    handleParent: (el: HTMLElement) => HTMLElement = e => e.parentElement || e
) {

    let parent: HTMLElement;
    let target: HTMLElement;

    const { initEvents, clearEvents } = initDrag();

    onMounted(() => {
        target = domRef.value;
        parent = handleParent(target);

        initEvents(target, parent);

        initWindowResize(parent);

    });

    onUnmounted(() => {
        clearEvents();
    });
}

function initDrag () {

    let left = 0;
    let top = 0;

    let parent: HTMLElement;
    let target: HTMLElement;
    let isFirst = true;

    let isMouseDown = false;

    let offsetX = 0;
    let offsetY = 0;

    const modifyPos = (e: MouseEvent) => {
        left = e.clientX - offsetX;
        top = e.clientY - offsetY;
        if (top < MenuHeight) top = MenuHeight;
        parent.style.transform = `translate(${left}px, ${top}px)`;
    };

    const clearMouseDown = () => {
        isMouseDown = false;
    };

    function onMouseMove (e: MouseEvent) {
        if (!isMouseDown) return;
        modifyPos(e);
    }

    function onMouseDown (e: MouseEvent) {
        isMouseDown = true;

        const { left, top } = target.getBoundingClientRect();
        offsetX = e.clientX - left;
        offsetY = e.clientY - top;

        if (isFirst) {
            modifyPos(e);
            isFirst = false;
            parent.style.left = '0';
            parent.style.top = '0';
        }
    }

    return {

        initEvents (_t: HTMLElement, _p: HTMLElement) {
            target = _t;
            parent = _p;

            target.addEventListener('mousedown', onMouseDown, false);
            window.addEventListener('mousemove', onMouseMove, false);
            target.addEventListener('mouseup', clearMouseDown, false);
            window.addEventListener('mouseup', clearMouseDown, false);
        },
        clearEvents () {
            target.removeEventListener('mousedown', onMouseDown, false);
            window.removeEventListener('mousemove', onMouseMove, false);
            target.removeEventListener('mouseup', clearMouseDown, false);
            window.removeEventListener('mouseup', clearMouseDown, false);
        }
    };
}

function createEdge (style: IJson): Ele {
    return ($.create('div')
        .cls('window-edge') as Ele)
        .style(style) as Ele;
}


function initWindowResize (parent: HTMLElement) {

    const top = createEdge({
        width: '100%',
        cursor: 'ns-resize',
        left: 0,
        top: 0,
    });
    const right = createEdge({
        height: '100%',
        cursor: 'ew-resize',
        top: 0,
        right: 0,
    });
    const bottom = createEdge({
        width: '100%',
        cursor: 'ns-resize',
        left: 0,
        bottom: 0,
    });
    const left = createEdge({
        height: '100%',
        cursor: 'ew-resize',
        top: 0,
        left: 0,
    });

    const l_t = createEdge({
        cursor: 'nwse-resize',
        top: 0,
        left: 0,
    });
    const r_t = createEdge({
        cursor: 'nesw-resize',
        top: 0,
        right: 0,
    });
    const r_b = createEdge({
        cursor: 'nwse-resize',
        bottom: 0,
        right: 0,
    });
    const l_b = createEdge({
        cursor: 'nesw-resize',
        bottom: 0,
        right: 0,
    });

    // @ts-ignore
    $.query(parent).append(
        top, right, bottom, left, l_t, r_t, r_b, l_b
    );


    // 左右缩放 ew-resize
    // 上下缩放 ns-resize
    // 右上 左下 nesw-resize
    // 左上 右下 nwse-resize
}