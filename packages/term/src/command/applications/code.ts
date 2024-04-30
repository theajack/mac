/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-30 00:02:07
 */

import type { File } from 'webos-disk';
import { catFile } from '../commands/cat';
import { Command } from '../commands/command-base';
import {
    compressString,
} from 'webos-utils';

export class CodeCommand extends Command {
    commandName = 'code';
    desc = 'open file with code mode in JSBox';
    get help (): string {
        return this.commandName + ' <filename>';
    }

    async main (args: string[]) {
        const target = await catFile(args, this.curDir);

        if (!target) return this.fail('Target is not exist');
        if (target.isDir) return this.fail('Target is not a file');

        const file = target as File;

        const content = await file.readText();

        if (!content) {
            return this.success('File content is Empty!');
        }

        const code = compressString(content + ''); // todo 不同类型 toString
        const type = 'javascript'; // todo 根据文件获取语言类型
        window.open(`https://theajack.github.io/jsbox/?theme=dark&lang=${type}&code=${code}`);
        return this.success('File opened successfully!');
    }
}
