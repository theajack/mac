
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-29 15:10:27
 */

// import { div } from 'alins';
import type { Dir } from 'webos-disk';
import { catFile } from './cat';
import { Command } from './command-base';

export class CpCommand extends Command {
    commandName = 'cp';
    desc = 'Copy file or directory';
    get help (): string {
        return this.commandName + ' <source path> <target directory>';
    }

    async main (args: string[]) {
        const [ sourcePath, targetPath ] = args;

        if (!sourcePath) return this.fail('Source path is empty!');
        if (!targetPath) return this.fail('Target path is empty!');

        const source = await catFile(sourcePath, this.curDir);

        if (!source) return this.fail('Source is not exist');
        const target = await catFile(targetPath, this.curDir);

        if (!target) return this.fail('Target is not exist');
        if (!target.isDir) return this.fail('Target is not a directory');

        const file = await (target as Dir).paste(source);

        return this.success(`Copy success ${source.pathString} => ${target.pathString}${file.name}`);
    }
}
