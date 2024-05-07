/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-27 15:38:34
 * @Description: Coding something
 */
import { WebApp } from '../web-app';
import { AppNames } from '../app-config';

export class WeChat extends WebApp {

    constructor () {
        super({
            title: 'WeChat',
            name: AppNames.wechat,
            url: 'https://wx.qq.com/',
        });
    }
    onOpen (): void {
        super.onOpen();
        this.msgCount = 0;
    }
}