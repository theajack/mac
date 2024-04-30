/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-29 11:34:22
 */

import { span, text } from 'alins';
import { style } from 'alins-style';
import { IFileBaseInfo, Dir, Path } from 'webos-disk';
import { Command } from './command-base';

export function lsItem (name: string) {
    return span(
        style.marginRight(20),
        text(name)
    );
}
export function lsFilesItem (info: IFileBaseInfo) {
    // todo 可以针对文件信息做更详细的展示
    return span(
        style.marginRight(20),
        text(info.name)
    );
}


export class LSCommand extends Command {
    commandName = 'ls';
    desc = 'Displays subfile information';
    get help () {
        return this.commandName + ' <dirname>';
    }

    async main (args: string[]) {
        const dir = await this.curDir.findDirByPath(Path.join(args[0]));
        if (dir) {
            if (dir.type === 'file') {
                return this.fail('Target is not a directory: ' + dir.name);
            }
            return this.success((dir as Dir).ls().map(name => lsItem(name)));
        } else {
            return this.fail('history not found');
        }
    }
}

// 打印目标目录的子文件 / 后面的会被忽略
export async function lsPathDir (value: string, dir: Dir) {
    // '' 转成 './'
    const path = dir.path.join(value || './').parentPath;
    // console.warn('parent=', dir.path, value, path);
    // const dir = dir.findDirByPath(path);
    // console.log('dir', dir?.path, dir?.lsDetail());
    return await (await dir.findDirByPath(path))?.lsDetail() || [];
}
