/*
 * @Author: tackchen
 * @Date: 2022-10-07 12:15:49
 * @Description: Coding something
 */

import { isDev } from '@/core/context';


export function initFullscreen () {
    if (isDev) return;
    window.addEventListener('click', () => {
        if (!isFullscreen()) {
            fullscreen();
        }
    }, true);

    const nav = navigator as any;
    if (nav.keyboard && nav.keyboard.lock) {
        // 禁止esc退出全屏，会以长按代替
        // 谷歌浏览器下才生效
        nav.keyboard.lock([ 'Escape' ]);
    }
}


function fullscreen () {
    // let el = document.querySelector('.g-render') || document.documentElement; // 直接全屏g-render 会导致视频全屏播放播放无法操作
    const el = document.documentElement as any;
    try {
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
            /* Firefox */
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            /* IE/Edge */
            el.msRequestFullscreen();
        }
    } catch (e) {}
}

// function exitFullscreen () {
//     const el = document as any;
//     try {
//         if (el.exitFullscreen) {
//             el.exitFullscreen();
//         } else if (el.mozCancelFullScreen) {
//         /* Firefox */
//             el.mozCancelFullScreen();
//         } else if (el.webkitExitFullscreen) {
//         /* Chrome, Safari and Opera */
//             el.webkitExitFullscreen();
//         } else if (el.msExitFullscreen) {
//         /* IE/Edge */
//             el.msExitFullscreen();
//         }
//     } catch (e) {}
// }


function isFullscreen () {
    const doc = document as any;
    if (doc.fullscreenElement
        ||    doc.msFullscreenElement
        ||  doc.mozFullScreenElement
        || doc.webkitFullscreenElement) {
        return true;
    }
    return false;
}
