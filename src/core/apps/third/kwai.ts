/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-27 15:38:34
 * @Description: Coding something
 */
import { WebApp } from '../web-app';
import { AppNames } from '../app-config';

export class KWai extends WebApp {

    constructor () {
        super({
            name: AppNames.kwai,
            url: 'https://www.kuaishou.com/new-reco',
        });
    }
}