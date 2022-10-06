/*
 * @Author: tackchen
 * @Date: 2022-10-05 18:44:59
 * @Description: Coding something
 */

import { ISelectItem } from '@/core/types/component';
import { ref } from 'vue';

export function createMenuStatus () {

    const activeIndex = ref(-2);

    function clearActive () {
        activeIndex.value = -2;
    }
    const onClickTitle = ({ item, index }: {item: ISelectItem[], index: number}) => {
        console.log(item, index);
    };
    const onMouseEnter = (e: MouseEvent) => {
        console.log(e);
    };

    window.addEventListener('click', () => {
        clearActive();
    }, false);

    return {
        activeIndex,
        onClickTitle,
        onMouseEnter
    };
}