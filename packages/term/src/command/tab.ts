/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-11 14:37:24
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-29 23:33:42
 */
import { pushResultError, pushResultItem } from '../ui/components/result-item';
import { IFileBaseInfo, Path } from 'webos-disk';
import { lsPathDir, lsItem, lsFilesItem } from './commands/ls';
import { Term } from '../../../term';
import { FileUtils } from 'webos-disk/src/files/file-utils';


export async function onTab (value: string, term: Term, hint = false) {
    const arr = FileUtils.split(value);
    // console.warn('onTab', arr);

    if (arr.length === 1) {
        const tabValue = arr[0];
        return handleResult(
            value,
            tabValue,
            term.commands.getCommandNames(),
            term,
            'command',
            hint,
        );
    } else {
        const [ commandName, subName ] = arr;

        const command = term.commands.getCommand(commandName);
        if (!command || !command.needHint) {
            return [];
        }

        const tabValue = arr[arr.length - 1];
        let name = tabValue;

        let list: (string|IFileBaseInfo)[] | null = null;
        let type = command.hint;

        const sub = command.subCommands[subName];
        if (typeof sub === 'object') {
            if (arr.length === 3) {
                if (sub.hint) type = sub.hint;
                if (sub.hintArray) list = sub.hintArray;
            }
        } else {
            const subs = Object.keys(command.subCommands);
            if (arr.length === 2 && subs.length > 0) {
                list = subs;
            }
        }

        if (!list) {
            if (type === 'none') {
                return [];
            }
            if (command.hintArray?.length > 0 || type === 'custom') {
                list = command.hintArray || [];
            } else if (type === 'command') {
                list = term.commands.getCommandNames();
            } else if (type === 'file') {

                // list = await lsPathDir(tabValue, term.currentDir);
                // const arr = value.split(' ');
                // let index = arr.length - 1;

                // let searchName = '';
                // let matched = false;

                // while (!matched && index > 0) {
                //     const matchValue = arr.slice(index).join(' ');
                //     index --;
                //     if (!matchValue) continue;
                //     searchName = matchValue.includes('/') ?
                //         FileUtils.splitLastStr(matchValue, '/')[1] :
                //         matchValue;
                //     const result = await lsPathDir(matchValue, term.currentDir);
                //     // @ts-ignore
                //     matched = !!result.find(item => item.name.startsWith(searchName));
                //     if (matched) {
                //         list = result;
                //         name = searchName;
                //     }
                // }

                name = Path.from(tabValue).last;
                list = await lsPathDir(tabValue, term.currentDir);
                // console.warn(tabValue, list);

                // console.warn(`lsPathDir value=${value} tabValue=${tabValue} name=${name} list=`, list);
            }
        }

        return handleResult(
            value,
            name,
            list || [],
            term,
            type,
            hint,
        );
    }

}

function handleResult (
    value: string,
    name: string,
    list: (string|IFileBaseInfo)[],
    term: Term,
    type: 'custom' | 'file' | 'command' | 'none' = 'custom',
    hint: boolean = false
) {
    const handleItem = type === 'file' ? (v: IFileBaseInfo) => v.name : (v:string) => v;
    const result = list.filter(n => handleItem(n as any).indexOf(name) === 0);
    if (hint) return result.map(item => handleItem(item as any));

    if (result.length === 0) {
        pushResultError(value, term, `No ${type} found`);
    } else if (result.length === 1) {

        // 处理 cd .. 只有一个目录的情况 补全最后一个 /
        const index = value.lastIndexOf(Path.Back);
        const split = index !== -1 && index === value.length - Path.Back.length ? Path.Split : '';

        let content = value.substring(0, value.lastIndexOf(name)) + split + handleItem(result[0] as any);
        if (type === 'file' && (result[0] as IFileBaseInfo).isDir) {
            content += '/';
        }
        if (type !== 'file') {
            content += ' ';// 命令后面补一个空格
        }
        term.global.inputContent.value = content;
        // console.warn(`term.global.inputContent.value = ${content};`);
    } else {
        const comp = type === 'file' ? lsFilesItem : lsItem;
        const arr: string[] = result.map(handleItem);
        const maxCommon = FileUtils.findMaxCommonHead(arr);
        const content = value.substring(0, value.lastIndexOf(name)) + maxCommon;
        term.global.inputContent.value = content;

        pushResultItem(value, term, result.map(i => comp(i as any)));
    }
    return [];
}