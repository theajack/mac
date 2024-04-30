/*
 * @Author: tackchen
 * @Date: 2022-09-22 10:11:01
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames, createEmptyStatus } from '../app-config';

export class Notes extends App {
    statusMenu = createEmptyStatus('Notes');

    constructor () {
        super({
            name: AppNames.notes
        });
    }
}