/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-23 22:02:43
 */

import { IJson } from 'webos-disk';
import { Command } from '../commands/command-base';

const WebsiteMap: IJson<string> = {
    github: 'github.com',
    npm: 'www.npm.com',
    baidu: 'www.baidu.com',
    腾讯视频: 'https://v.qq.com',
    网易云音乐: 'https://music.163.com/',
    qq: 'www.qq.com',
    w3school: 'www.w3school.com.cn',
    runoob: 'www.runoob.com',
    vue: 'https://vuejs.org/',
    react: 'https://reactjs.org/',
    angular: 'https://angular.io',
    alins: 'https://alinsjs.github.io/docs/',
    掘金: 'https://juejin.cn/',
    csdn: 'https://www.csdn.net/',
    gitee: 'www.gitee.com',
};

export class OpenCommand extends Command {
    commandName = 'open';
    desc = 'Open website';
    hint: 'custom' = 'custom';
    hintArray = Object.keys(WebsiteMap);
    get help (): string {
        return this.commandName + ' <content>';
    }

    async main (args: string[]) {

        const name = args[0];

        const handleUrl = (v: string) => v.indexOf('http') === 0 ? v : `https://${v}`;

        if (WebsiteMap[name]) {
            window.open(handleUrl(WebsiteMap[name]));
        } else {
            window.open(handleUrl(name));
        }

        return this.success();
    }
}
