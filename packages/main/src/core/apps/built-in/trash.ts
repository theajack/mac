/*
 * @Author: tackchen
 * @Date: 2022-09-22 11:22:43
 * @Description: Coding something
 */
import { appIcon } from '@/lib/utils';
import { App } from '../app';
import { AppNames } from '../app-config';
import type { ISelectItem } from '@/core/types/component';

export class Trash extends App<Trash> {

    isVirtualApp = true;

    dockMenu: ISelectItem[] = [
        {
            name: 'Open',
        },
        {
            isSplit: true
        },
        {
            name: 'Empty Trash',
            disabled: false,
            onClick: (item: ISelectItem) => {
                this.proxy().emptyTrash();
                item.disabled = true;
            }
        },
    ];

    constructor () {
        super({
            iconRadius: 0,
            name: AppNames.trash
        });
        // todo
        this.fullTrash();
        this.initDir().then(() => {
            this.setIcon(this.dir.isEmpty);
        });
    }

    // onOpen (): void | Window | null {
    //     return null;
    // }

    fullTrash () {
        this.setIcon(false);
    }
    emptyTrash () {
        // console.log(111);
        // window.t2 = this;
        this.setIcon(true);
    }

    private setIcon (isEmpty: boolean) {
        this.icon = appIcon(isEmpty ? 'trash' : 'trash-full');
    }
}