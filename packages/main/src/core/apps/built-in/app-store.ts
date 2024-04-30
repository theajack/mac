/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames, createEmptyStatus } from '../app-config';

export class AppStore extends App {
    statusMenu = createEmptyStatus('AppStore');

    constructor () {
        super({
            name: AppNames.appStore,
        });
    }
}