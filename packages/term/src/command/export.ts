/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-23 09:03:09
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 09:01:43
 */
import { saveFileContent } from '../ui/components/editor';
import { Disk, Path } from 'webos-disk';
import { Command } from './commands/command-base';
import { touchFile } from './commands/touch';

(window as any).TermBridge = {
    getDisk: () => Disk.instance,
    Path,
    async saveFileContent (path: string, content: string) {
        const { type } = await touchFile(path);
        if (type !== 'error') {
            await saveFileContent(path, content);
        }
    }
};
(window as any).BaseCommand = Command;
