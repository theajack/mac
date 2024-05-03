/*
 * @Author: tackchen
 * @Date: 2022-09-22 11:22:43
 * @Description: Coding something
 */
import { appIcon } from '@/lib/utils';
import { App } from '../app';
import { AppNames } from '../app-config';
import type { ISelectItem } from '@/core/types/component';
import type { FileBase } from 'webos-term';
import { FinderUtils } from './finder/js/finder-store';
import { StringText } from '@/core/string';

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
            id: 'EmptyTrash',
            name: 'Empty Trash',
            disabled: false,
            onClick: (item: ISelectItem) => {
                this.proxy().emptyTrash();
                item.disabled = true;
            }
        },
    ];

    onOpenCustom = () => {
        console.log('onOpenCustom Trash');
        this.callApp(AppNames.finder, {
            path: StringText.trashDir
        });
    };

    constructor () {
        super({
            iconRadius: 0,
            name: AppNames.trash
        });
        this.manager.systemDir.ensureDir({
            name: 'Trash',
            isSystemFile: true,
        }).then((dir) => {
            this.dir = dir;
            this.refreshTrashIcon();
        });
    }

    private refreshTrashIcon () {
        const target = this.proxy ? this.proxy() : this;
        target.icon = appIcon(this.dir.isEmpty ? 'trash' : 'trash-full');

        // ! docker 里的图标的右键菜单
        const item = target.dockMenu.find(item => item.id === 'EmptyTrash');
        if (item) {
            item.disabled = this.dir.isEmpty;
        }
    }

    async emptyTrash () {
        if (this.dir.isEmpty) return;
        await this.dir.clearDir();
        const store = FinderUtils.getStore();
        if (store && FinderUtils.isInTrash(store.getCurPath())) {
            store.entryDir(StringText.trashDir);
        }
        this.refreshTrashIcon();
    }


    async recycleFiles (items: FileBase[]) {
        // this.manager.
        for (let i = 0; i < items.length; i++) {
            const file = items[i];
            await file.moveTo(
                this.manager.trash.dir.pathString,
                true,
                '.Recycle'
            );
        }
        this.refreshTrashIcon();
    }

    async putFilesBack (items: FileBase[]) {
    }


}