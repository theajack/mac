/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-27 15:38:34
 * @Description: Coding something
 */
import { WebApp } from '../web-app';
import { AppNames } from '../app-config';

export class Meitu extends WebApp {

    constructor () {
        super({
            title: 'MeiTu',
            name: AppNames.meitu,
            url: 'https://www.x-design.com/editor/?from=icon&matrix_channel=mtxx_web',
        });
    }
}