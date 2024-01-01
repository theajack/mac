/*
 * @Author: tackchen
 * @Date: 2022-09-22 11:22:43
 * @Description: Coding something
 */
import { appIcon } from '@/lib/utils';
import { App } from '../app';
import { AppNames } from '../app-config';

export class Trash extends App {

    isVirtualApp = true;

    constructor () {
        super({
            iconRadius: 0,
            name: AppNames.trash
        });
        this.fullTrash();
    }

    fullTrash () {
        this.icon = appIcon('trash-full');
    }
    emptyTrash () {
        this.icon = appIcon(this.name);
    }
}