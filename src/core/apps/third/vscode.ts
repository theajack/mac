/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-27 15:38:34
 * @Description: Coding something
 */
import { WebApp } from '../web-app';
import { AppNames } from '../app-config';

export class Vscode extends WebApp {

    constructor () {
        super({
            title: 'Visual Studio Code',
            name: AppNames.vscode,
            url: 'https://codingcorp.cloudstudio.net/ws/ikqyzt'
        });
    }
}