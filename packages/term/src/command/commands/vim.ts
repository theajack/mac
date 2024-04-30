/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 */

// import { div } from 'alins';
import { File, Path } from 'webos-disk';
import { catFile } from './cat';
import { Command } from './command-base';
import { touchFile } from './touch';

export class VimCommand extends Command {
    commandName = 'vim';
    desc = 'Edit file content';
    get help () {
        return this.commandName + ' <filename>';
    }
    async main (args: string[]) {
        const target = await catFile(args, this.curDir);

        let content = '';
        let fromTouch = false;
        if (!target) {
            const { type, msg } = await touchFile(args[0], this.curDir);
            if (type !== 'success') return this.fail(msg);
            fromTouch = true;
        } else {
            if (target.isDir) return this.fail('Target is not a file');
            const file = target as File;
            content = await file.readText();
        }

        setTimeout(() => {
            const path = target ? target.path.path : Path.join(this.term.currentPath, args[0]);
            this.term.global.Edit.enterEdit(path, content, fromTouch);
        });

        return this.success();
    }
}
