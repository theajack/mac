/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-27 15:38:34
 * @Description: Coding something
 */
import { WebApp } from '../web-app';
import { AppNames } from '../app-config';

export class QQMusic extends WebApp {

    constructor () {
        super({
            title: 'QQMusic',
            iconScale: true, // 懒得裁剪图片了
            name: AppNames.qqmusic,
            url: 'https://y.qq.com',
        });
    }
}