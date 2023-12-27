/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames } from '../app-config';

export class AppStore extends App {

    constructor () {
        super({
            name: AppNames.appStore,
        });
    }
}