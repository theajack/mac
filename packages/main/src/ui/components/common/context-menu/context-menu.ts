/*
 * @Author: tackchen
 * @Date: 2022-10-07 22:28:31
 * @Description: Coding something
 */
import { type ISelectItem, type ISelectList } from '@/core/types/component';
import { ref } from 'vue';
import { toast } from '../toast/toast';
import type { App } from '@/core/apps/app';
import { CommonMargin, WinHeightNoDock, WindowWidth } from '@/ui/style/common';
import { useGlobalStore } from '@/ui/store';
import { FinderUtils } from '@/core/apps/built-in/finder/js/finder-store';
import { SelectType } from '@/core/enum';
import type { FileBase } from 'webos-term';

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

export function createSortByMenu (): ISelectItem[] {
    return checkContextCheckList([
        {
            name: 'None',
            onClick,
        },
        {
            isSplit: true,
        },
        {
            name: 'Snap to Grid',
            onClick,
        },
        {
            isSplit: true,
        },
        {
            name: 'Name',
            checked: true,
            onClick,
        },
        {
            name: 'Kind',
            onClick,
        },
        {
            name: 'Date Last Opened',
            onClick,
        },
        {
            name: 'Date Added',
            onClick,
        },
        {
            name: 'Date Modified',
            onClick,
        },
        {
            name: 'Date Created',
            onClick,
        },
        {
            name: 'Size',
            onClick,
        },
        {
            name: 'Tags',
            onClick,
        },
    ] as ISelectList);
}

export const DefaultMenuList: ()=>ISelectItem[] = () => [
    {
        name: 'New Folder',
        onClick,
    }, {
        isSplit: true,
    }, {
        name: 'Get Info',
        onClick,
    }, {
        name: 'Change Wallpaper...',
        onClick,
    }, {
        name: 'Edit Widgets...',
        onClick,
    }, {
        isSplit: true,
    }, {
        name: 'Use Stacks',
        onClick,
    }, {
        name: 'Test Multi',
        onClick,
        children: [ {
            name: 'test1',
            onClick,
        }, {
            name: 'test2',
            onClick,
            children: [ {
                name: 'test1',
                onClick,
            }, {
                name: 'test2',
                onClick,
            } ]
        }, {
            name: 'test3',
            onClick,
        }, ]
    }, {
        name: 'Sort By',
        onClick,
        children: createSortByMenu(),
    }, {
        name: 'Show View Options',
        onClick,
    }
];

let dom: HTMLElement;

export function initDom (domRef: HTMLElement) {
    dom = domRef;
}

function createContextMenuRef () {
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

        // 对齐macos的设计
        position.value.left = (clientX > minLeft) ?
            clientX - cacheWidth : clientX;

        const minTop = WinHeightNoDock - CommonMargin - cacheHeight;
        // console.log('shapeSize', clientY, minTop, cacheHeight);
        position.value.top = (clientY > minTop) ? minTop : clientY;

        if (cacheHeight !== 0) {
            position.value.opacity = 1;
        }
    };

    const contextmenu = (e: MouseEvent, list?: ISelectItem[]) => {
        useGlobalStore().replaceMenuList(list || DefaultMenuList());
        const { clientX, clientY } = e;

        position.value = {
            left: clientX,
            top: clientY,
            opacity: 0,
        };

        shapeSize(e);

        setTimeout(() => {
            const { offsetHeight, offsetWidth } = dom;
            if (cacheHeight !== offsetHeight || cacheWidth !== offsetWidth) {
                cacheWidth = offsetWidth;
                cacheHeight = offsetHeight;
                shapeSize(e);
            }
            position.value.opacity = 1;
        }, 0);

        visible.value = true;
        e.preventDefault();
    };
    window.document.addEventListener('click', () => {
        visible.value = false;
    }, false);

    return {
        position,
        visible,
        contextmenu,
    };
}

let ContextMenuRef: ReturnType<typeof createContextMenuRef>;

export function useContextMenuRef (listGene = DefaultMenuList) {
    if (!ContextMenuRef) {
        ContextMenuRef = createContextMenuRef();
    }

    return {
        ...ContextMenuRef,
        async contextmenu (e: MouseEvent) {
            const list = listGene();
            const store = FinderUtils.getStore();

            if (store) {
                // 在finder中右键的
                // console.log(files, list);
                const files = await FinderUtils.getSelectedFiles();

                const isAllFileLocked = !files.find(item => !(
                    FinderUtils.isFileLocked(item.isSystemFile, item.pathString)
                ));
                const isSingleFile = files.length === 1;
                const isInTrash = FinderUtils.isInTrash(store.getCurPath() + '/');
                list.forEach(item => {
                    item.disabled = false;
                    const types = Array.isArray(item.type) ? item.type : [ item.type ];
                    for (const type of types) {
                        if (item.disabled) return;
                        switch (type) {
                            case SelectType.FileLocked:
                                item.disabled = isAllFileLocked;
                                break;
                            case SelectType.SingleFile:
                                item.disabled = !isSingleFile;
                                break;
                            case SelectType.NoTrash:
                                item.disabled = isInTrash;
                                break;
                            default: break;
                        }
                    }
                });
            }

            ContextMenuRef.contextmenu(e, list);
        }
    } as typeof ContextMenuRef;
}

export function checkContextCheckList (list: ISelectItem[]) {

    const isCheckList = list.find(item => item.checked === true);

    if (isCheckList) {
        list.forEach(item => {
            if (!item.checked && !item.isSplit) {
                item.checked = false;
            }
            const origin = item.onClick;
            if (origin) {
                item.onClick = (...args: any[]) => {
                    const proxy = (list as ISelectList).proxy();
                    // list.
                    const selfProxy = proxy.find(each => {
                        return each.name === item.name;
                    });
                    const checkedProxy = proxy.find(each => {
                        return each.checked === true;
                    });
                    // console.log(selfProxy, checkedProxy);
                    checkedProxy!.checked = false;
                    selfProxy!.checked = true;
                    origin?.apply(item, args);
                };
            }
        });
    }
    return list;
}