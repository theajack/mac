/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-04 00:17:14
 */

import { div } from 'alins';
import { Command } from './command-base';

export class MkdirCommand extends Command {
    commandName = 'mkdir';
    desc = 'Create a directory';
    get help () {
        return this.commandName + ' <dirname>';
    }

    async main (args: string[]) {
        const name = args[0];

        if (!name) {
            return this.fail('mkdir: Dir name is empty');
        }

        try {
            if (await this.curDir.createChildByPath(name, true)) {
                return this.success(div('success'));
            }
            return this.fail('mkdir failed: Target Path is exist:' + name);
        } catch (e) {
            console.error(e);
            return this.fail('mkdir failed: ' + name);
        }
    }
}
