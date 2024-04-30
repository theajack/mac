/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 09:01:00
 */

import { div, text } from 'alins';
import { Dir, Disk } from 'webos-disk';
import { Command } from './command-base';

export async function touchFile (name: string, dir: Dir = Disk.instance) {
    try {
        if (await dir.createChildByPath(name, false)) {
            return { type: 'success', msg: '' };
        }
        return { type: 'exist', msg: 'Touch failed: Target File is exist:' + name };
    } catch (e) {
        console.error(e);
        return { type: 'error', msg: 'Touch Error: ' + name };
    }
}

export class TouchCommand extends Command {
    commandName = 'touch';
    desc = 'Create file';
    needHint = false;
    get help () {
        return this.commandName + ' <filename>';
    }
    async main (args: string[]) {
        const name = args[0];

        if (!name) {
            return this.fail('Touch: Dir name is empty');
        }

        const { type, msg } = await touchFile(name, this.curDir);

        if (type === 'success') {
            return this.success(div(text('Touch File Success: ' + name)));
        }
        return this.fail(msg);

    }
}
