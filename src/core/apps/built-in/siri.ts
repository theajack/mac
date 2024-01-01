/*
 * @Author: tackchen
 * @Date: 2022-09-22 10:11:01
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames, createEmptyStatus } from '../app-config';

export class Siri extends App {
    statusMenu = createEmptyStatus('Siri');
    constructor () {
        super({
            name: AppNames.siri
        });
    }
}