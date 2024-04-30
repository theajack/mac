/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-23 22:04:38
 */

// import { div } from 'alins';
import { catFile } from './cat';
import { Command } from './command-base';

export class RmCommand extends Command {
    commandName = 'rm';
    desc = 'Remove file or directory';

    async main (args: string[]) {
        const target = await catFile(args, this.curDir);

        if (!target) return this.fail('Target is not exist');

        await target.remove();

        return this.success(`Removed ${target.path.path}!`);
    }
}
