/*
 * @Author: tackchen
 * @Date: 2022-09-22 10:11:01
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames } from '../app-config';

export class Github extends App {

    constructor () {
        super({
            name: AppNames.github
        });
    }
    onOpen (): void {
        window.open('https://github.com/theajack/mac');
    }
}