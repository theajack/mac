/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 09:10:44
 */

import { div, text } from 'alins';
import { Command } from './command-base';

export class FindCommand extends Command {
    commandName = 'find';
    desc = 'Filter file or directory with name';
    get help (): string {
        return this.commandName + ' <querystring>';
    }

    async main (args: string[]) {
        const result = this.curDir.filerChild(args[0]);
        if (result.length === 0) return this.fail('No file or directory found');

        return this.success(
            result.map(item => div(text(`${item.path.path}${item.isDir ? '/' : ''}`)))
        );
    }
}
