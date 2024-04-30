/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-04 00:17:39
 */

import { Command } from './command-base';

export class PWDCommand extends Command {
    commandName = 'pwd';
    desc = 'show current path';
    get help () {
        return this.commandName;
    }

    async main () {
        return this.success(this.curPath);
    }
}
