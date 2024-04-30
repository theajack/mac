/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-27 15:38:34
 * @Description: Coding something
 */
import { WebApp } from '../web-app';
import { AppNames } from '../app-config';

export class Bilibili extends WebApp {

    constructor () {
        super({
            name: AppNames.bilibili,
            url: 'https://www.bilibili.com/',
            // url: 'https://y.qq.com/', QQMusic
            // url: 'https://theajack.gitee.io/jsbox',
            // url: 'https://www.kuaishou.com/new-reco' Kwai
        });
    }
}