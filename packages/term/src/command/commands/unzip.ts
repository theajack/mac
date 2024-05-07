/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-06 20:35:38
 */

import type { File } from 'webos-disk';
import { Path } from 'webos-disk';
import { catFile } from './cat';
import { Command } from './command-base';

export class UnZipCommand extends Command {
    commandName = 'unzip';
    desc = 'Unzip file or directory';
    get help (): string {
        return this.commandName + ' <source filepath> <target directory>';
    }

    async main (args: string[]) {
        // eslint-disable-next-line prefer-const
        let [ sourcePath, targetPath ] = args;

        if (!sourcePath) return this.fail('Source path is empty!');
        if (!targetPath) targetPath = '.';

        // 压缩文件
        const source = (await catFile(sourcePath, this.curDir)) as File;

        if (!source) return this.fail('Source is not exist');
        if (!source.isZip) return this.fail('Source is not zip file');

        targetPath = Path.join(this.curDir.pathString, targetPath);

        // 解压存放的目标路径
        const dir = await this.curDir.ensureDirByPath(targetPath);

        await source.unzipTo(dir);

        return this.success(`Unzip success ${source.name} => ${dir.pathString}.`);
    }
}
