/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-06 19:24:44
 */

import { FileUtils, type FileBase, Path, ZipUtils } from 'webos-disk';
import { catFile } from './cat';
import { Command } from './command-base';

export class ZipCommand extends Command {
    commandName = 'zip';
    desc = 'Zip file or directory';
    get help (): string {
        return this.commandName + ' <source filepath>{n} <target path>';
    }

    async main (args: string[]) {
        const curPath = this.curDir.pathString;
        let targetPath = args.pop();
        const sourcePaths = args;

        if (!sourcePaths) return this.fail('Source path is empty!');
        if (!targetPath) return this.fail('Target path is empty!');

        // 待压缩的文件
        const files: FileBase[] = [];
        for (const path of sourcePaths) {
            const source = await catFile(path, this.curDir);
            if (!source) return this.fail(`Source is not exist: ${path}`);
            files.push(source);
        }

        if (targetPath === '.') targetPath += '/';

        // [目标目录, 文件名称]
        // eslint-disable-next-line prefer-const
        let [ dirname, filename ] = Path.join(curPath, targetPath);

        // 压缩包存放的目录
        const dir = await this.curDir.ensureDirByPath(dirname);

        if (!filename) filename = 'Archive.zip';
        // 压缩包文件名
        filename = FileUtils.ensureFileRepeatName(filename, dir?.allChildren);
        const content = await ZipUtils.zip(files);
        await dir.createFile({ name: filename, content });
        return this.success(`Zip success ${Path.join(dir.pathString, filename)}.`);
    }
}
