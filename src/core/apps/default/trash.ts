/*
 * @Author: tackchen
 * @Date: 2022-09-22 11:22:43
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames } from '../app-config';

export class Trash extends App {
    constructor () {
        super({
            name: AppNames.trash
        });
    }
}