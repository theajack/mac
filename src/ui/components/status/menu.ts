/*
 * @Author: tackchen
 * @Date: 2022-10-05 18:44:59
 * @Description: Coding something
 */

import { ref } from 'vue';

export function createMenuStatus () {

    const activeIndex = ref(-2);

    function clearActive () {
        activeIndex.value = -2;
    }
    const onClickTitle = (index: number) => {
        if (index === activeIndex.value) {
            clearActive();
        } else {
            activeIndex.value = index;
        }
    };
    const onMouseEnter = (index: number) => {
        if (activeIndex.value !== -2) {
            activeIndex.value = index;
        }
    };

    window.addEventListener('click', (e) => {
        const el = e.target as HTMLElement;
        if (
            el.classList.contains('menu-title') ||
            el.parentElement?.classList.contains('menu-bar-item')
        ) return;
        clearActive();
    }, false);

    return {
        activeIndex,
        onClickTitle,
        onMouseEnter
    };
}