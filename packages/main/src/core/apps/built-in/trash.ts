/*
 * @Author: tackchen
 * @Date: 2022-09-22 11:22:43
 * @Description: Coding something
 */
import { appIcon } from '@/lib/utils';
import { App } from '../app';
import { AppNames } from '../app-config';
import type { ISelectItem } from '@/core/types/component';
import { DiskString, parseJson, type File, type FileBase, FileUtils } from 'webos-term';
import { FinderUtils } from './finder/js/finder-utils';
import { StringText } from '@/core/string';
import type { IJson } from '@/types';

export class Trash extends App<Trash> {

    isVirtualApp = true;

    configFile: File;

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
    }

    // 会在new之后执行
    async init () {
        this.dir = await this.manager.systemDir.ensureDir({
            name: 'Trash',
            isSystemFile: true,
        });
        this.configFile = await this.dir.ensureFile({
            name: `trash_config.${DiskString.hiddenExt}`
        });
        this.refreshTrashIcon();
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
        await this.saveTrashConfig({});
    }

    async deleteFiles (items: FileBase[]) {
        if (items.length === 0) return;
        const { config, save } = await this.useTrashConfig();
        for (const file of items) {

            await file.remove();
            if (config[file.name]) {
                delete config[file.name];
            }
        }
        await save();
    }


    async recycleFiles (items: FileBase[]) {
        if (items.length === 0) return;
        const { config, save } = await this.useTrashConfig();
        // this.manager.
        for (let i = 0; i < items.length; i++) {
            const file = items[i];
            const originPath = file.pathString;
            const newName = await file.moveTo({
                targetDirPath: this.manager.trash.dir.pathString,
                renameIfConflict: true,
                repeatMark: '.Recycle'
            });
            config[newName] = originPath;
        }
        await save();
    }

    async putFilesBack (items: FileBase[]) {
        if (items.length === 0) return;
        const { config, save } = await this.useTrashConfig();

        for (const file of items) {
            const name = file.name;
            const originPath = config[name];
            if (originPath) {
                await file.moveTo({
                    targetDirPath: FileUtils.extractDirPath(originPath),
                    renameIfConflict: true,
                    newName: FileUtils.extractFileName(originPath),
                    repeatMark: '.PutBack'
                });
                delete config[name];
            }
        }
        await save();
    }

    private async saveTrashConfig (config: IJson) {
        await this.configFile.writeText(JSON.stringify(config));
        this.refreshTrashIcon();
    }

    private async useTrashConfig () {
        const config = parseJson(await this.configFile.readText()) || {};
        return {
            config,
            save: async () => {
                await this.saveTrashConfig(config);
            },
        };
    }


}