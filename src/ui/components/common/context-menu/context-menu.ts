/*
 * @Author: tackchen
 * @Date: 2022-10-07 22:28:31
 * @Description: Coding something
 */
import type { ISelectItem } from '@/core/types/component';
import { ref } from 'vue';
import { toast } from '../toast/toast';
import type { App } from '@/core/apps/app';
import { CommonMargin, WinHeightNoDock, WindowHeight, WindowWidth } from '@/ui/style/common';

const onClick = function (this: ISelectItem) {
    toast({
        title: 'On ContextMenu',
        content: this.name || '',
        buttonText: 'Button'
    });
};

export function createDockAppMenuList (app: App): ISelectItem[] {
    return [
        {
            name: 'New Window',
            onClick () {
                app.openNewWindow();
            },
        },
        {
            isSplit: true,
        },
        {
            name: 'Options',
            onClick,
            children: [ {
                name: 'Remove from Dock',
                onClick,
            }, {
                name: 'Open at Login',
                onClick,
            }, {
                name: 'Show in Finder',
                onClick,
            } ]
        },
        {
            isSplit: true,
        },
        {
            name: 'Show All Windows',
            onClick () {
                app.showAllWindows();
            },
        },
        {
            name: 'Hide',
            onClick () {
                app.hide();
            }
        },
        {
            name: 'Quit',
            onClick () {
                app.closeApp();
            },
        },
    ];
}

export const globalMenuList: ISelectItem[] = [
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
            children: [ {
                name: 'test2-1',
                onClick,
            }, {
                name: 'test2-2',
                onClick,
            }, {
                name: 'test2-3',
                onClick,
            }, {
                name: 'test2-4',
                onClick,
            } ]
        }, {
            name: 'test3',
            onClick,
        }, {
            name: 'test4',
            onClick,
        } ]
    }, {
        name: 'Show View Options',
        onClick,
    }
];

export function createContextMenuRef (getDom: ()=>HTMLElement) {
    const visible = ref(false);
    const position = ref({
        left: 0,
        top: 0,
        opacity: 0,
    });

    let cacheHeight = 0, cacheWidth = 0;

    const shapeSize = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const minLeft = WindowWidth - CommonMargin - cacheWidth;
        if (clientX > minLeft) {
            // position.value.left = minLeft;
            // 对齐macos的设计
            position.value.left = clientX - cacheWidth;
        }
        const minTop = WinHeightNoDock - CommonMargin - cacheHeight;
        if (clientY > minTop) {
            position.value.top = minTop;
        }
        if (cacheHeight !== 0) {
            position.value.opacity = 1;
        }
    };

    const contextmenu = (e: MouseEvent) => {

        const { clientX, clientY } = e;

        position.value = {
            left: clientX,
            top: clientY,
            opacity: 0,
        };

        shapeSize(e);

        setTimeout(() => {
            const dom = getDom();
            const { offsetHeight, offsetWidth } = dom;
            if (cacheHeight !== offsetHeight || cacheWidth !== offsetWidth) {
                cacheWidth = offsetWidth;
                cacheHeight = offsetHeight;
                shapeSize(e);
            }
            position.value.opacity = 1;
        });

        visible.value = true;
        e.preventDefault();
    };
    window.addEventListener('click', () => {
        visible.value = false;
    }, true);

    return {
        position,
        visible,
        contextmenu,
    };
}