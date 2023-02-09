/*
 * @Author: tackchen
 * @Date: 2022-10-06 21:42:23
 * @Description: Coding something
 */

import { App } from '@/core/apps/app';
import { AudioPlayer } from '@/core/audio';
import { getToast } from '@/core/context';
import { delay } from '@/lib/utils';

export interface IToastMessage {
    from?: App;
    title?: string;
    content: string;
    onClick?: () => void;
    onButtonClick?: () => void;
    buttonText?: string;
    duration?: number;
}

export interface IToastData extends IToastMessage{
    visible: boolean;
    timer?: number;
}

function clearToastTimer () {
    clearTimeout(getToast().value.timer);
}

function startToastTimer () {
    const toast = getToast();
    toast.value.timer = setTimeout(() => {
        toast.value.visible = false;
    }, toast.value.duration);
}

export function toastText (content: string) {
    toast({ content });
}

export async function toast ({
    from,
    title,
    content,
    onClick,
    onButtonClick,
    buttonText,
    duration = 3000,
}: IToastMessage) {
    const toast = getToast();

    if (!title && from) {
        title = from.title;
    }

    Object.assign(toast.value, {
        from,
        title,
        content,
        onClick,
        onButtonClick,
        buttonText,
        duration,
    });

    // todo 播放声音
    AudioPlayer.toast();

    if (toast.value.visible) {
        // todo 是否考虑缓存消息队列
        toast.value.visible = false;
        await delay(300);
    }

    clearToastTimer();

    toast.value.visible = true;

    startToastTimer();
}

export function createToastRef () {
    const toast = getToast();

    function clearToast () {
        toast.value.visible = false;
    }

    return {
        toast, clearToast,
        onClick () {
            console.log('click');
            if (toast.value.onClick) {
                toast.value.onClick();
            }
        },
        onButtonClick () {
            console.log('onButtonClick');
            if (toast.value.onButtonClick) {
                toast.value.onButtonClick();
            }
        },
        onMouseEnter () {
            clearToastTimer();
        },
        onMouseLeave () {
            startToastTimer();
        }
    };
}