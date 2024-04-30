/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 09:04:27
 */

// import { div } from 'alins';
import { div, text } from 'alins';
import { CommonStyle } from '../../ui/css/main-css';
import { Dir, Disk, File, Path } from 'webos-disk';
import { Command } from './command-base';
import { style } from 'alins-style';

export function catFile (args: string|string[], dir: Dir = Disk.instance) {
    const path = typeof args === 'string' ? Path.join([ args ]) : Path.join(...args);
    return dir.findChildByPath(path);
}

export class CatCommand extends Command {
    commandName = 'cat';
    desc = 'Displat file content';
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
            return this.success(div(
                CommonStyle.SuccessColor,
                'File content is empty'
            ));
        }

        return this.success(
            div(
                style.whiteSpace('pre'),
                text(content)
            )
        );
    }
}
