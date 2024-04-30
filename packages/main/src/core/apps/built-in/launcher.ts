/*
 * @Author: tackchen
 * @Date: 2022-09-22 10:11:01
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames } from '../app-config';
import { useGlobalStore } from '@/ui/store';

export class Launcher extends App {

    isVirtualApp = true;

    constructor () {
        super({
            name: AppNames.launcher
        });
    }

    onOpen () {
        const store = useGlobalStore();
        store.showLauncher = !store.showLauncher;
        return null;
    }
}