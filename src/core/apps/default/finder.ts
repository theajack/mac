/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames, createEmptyStatus } from '../app-config';
import { IAppStatus } from '../type';

const status: IAppStatus = createEmptyStatus();

export class Finder extends App {

    constructor () {
        super({
            name: AppNames.finder,
            status,
        });
    }
}