/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-05 21:47:01
 */

// import { div } from 'alins';
import { catFile } from './cat';
import { Command } from './command-base';

export class MoveCommand extends Command {
    commandName = 'mv';
    desc = 'Move file or directory';
    get help (): string {
        return this.commandName + ' <source path> <target directory>';
    }

    async main (args: string[]) {
        const [ sourcePath, targetPath ] = args;

        if (!sourcePath) return this.fail('Source path is empty!');
        const source = await catFile(sourcePath, this.curDir);
        if (!source) return this.fail('Source is not exist');

        if (!targetPath) return this.fail('Target path is empty!');
        const target = await catFile(targetPath, this.curDir);
        if (!target) return this.fail('Target is not exist');

        if (!target.isDir) return this.fail('Target is not a directory');

        const name = await source.moveTo({ targetDirPath: targetPath });

        return this.success(`Move success ${source.pathString} => ${target.pathString}${name}`);
    }
}
