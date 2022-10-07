/*
 * @Author: tackchen
 * @Date: 2022-10-07 22:28:31
 * @Description: Coding something
 */
import { ISelectItem } from '@/core/types/component';
import { ref } from 'vue';
import { toast } from '../toast/toast';

const onClick = function (this: ISelectItem) {
    toast({
        title: 'On ContextMenu',
        content: this.name || '',
        buttonText: 'Button'
    });
};

const DefaultMenu: ISelectItem[] = [
    {
        name: 'New Folder',
        onClick,
    }, {
        isSplit: true,
    }, {
        name: 'Get Info',
        onClick,
    }, {
        name: 'Change Desktop Background...',
        onClick,
    }, {
        isSplit: true,
    }, {
        name: 'Use Stacks',
        onClick,
    }, {
        name: 'Sort By',
        onClick,
        children: [ {
            name: 'test1',
            onClick,
        }, {
            name: 'test2',
            onClick,
        } ]
    }, {
        name: 'Clean Up',
        onClick,
    }, {
        name: 'Clean Up By',
        onClick,
        children: [ {
            name: 'test1',
            onClick,
        }, {
            name: 'test2',
            onClick,
        } ]
    }, {
        name: 'Show View Options',
        onClick,
    }
];

export function createContextMenuRef () {

    const visible = ref(false);
    const list = ref(DefaultMenu);// todo 适配app
    const position = ref({
        left: 0,
        top: 0,
    });

    window.addEventListener('contextmenu', (e) => {
        position.value = {
            left: e.clientX,
            top: e.clientY,
        };
        // todo 超出屏幕部分进行重新定位计算
        visible.value = true;
        e.preventDefault();
    }, true);
    window.addEventListener('click', () => {
        visible.value = false;
    }, true);

    return {
        position,
        list,
        visible
    };
}