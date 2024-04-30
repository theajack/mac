/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-29 12:29:28
 */

import { div, text } from 'alins';
import { Command, ISubCommands } from '../commands/command-base';

const BookList = 'book_list';

export class BookmarkCommand extends Command {
    commandName = 'bookmark';
    desc = 'Bookmark manager';
    hint: 'none' = 'none';

    get help (): string {
        return `${this.commandName} <${this.subNames.join('|')}> <content>`;
    }
    subCommands: ISubCommands = {

        list: {
            help: `${this.commandName} list`,
            async init () {
                const json = await this.readSubJson(BookList);
                const list = Object.keys(json || {});
                this.getSub('open').hintArray = list;
                this.getSub('remove').hintArray = list;
                // sub.hintArray = Object.keys(json || {});
                // console.log('open init', sub.hintArray);
            },
            async main () {
                const json = await this.readSubJson(BookList) || {};
                return this.success(Object.keys(json).map(key => {
                    return div(text(`${key}: ${json[key]}`));
                }));
            }
        },
        open: {
            hintArray: [],
            help: `${this.commandName} open <name|url>`,
            async main (args) {
                const [ name ] = args;
                const json = await this.readSubJson(BookList) || {};
                const value: string = json[name] || name;
                window.open(value.startsWith('http') ? value : `https://${value}`);
                return this.success();
            }
        },
        add: {
            hint: 'none',
            help: `${this.commandName} add [name] <url>`,
            async main (args) {
                const [ name, url ] = args;
                await this.appendSubJson(BookList, name, url || '');
                this.getSub('open').hintArray?.push(name);
                return this.success();
            }
        },
        remove: {
            hintArray: [],
            help: `${this.commandName} remove <name|url>`,
            async main (args) {
                const [ name ] = args;
                const json = await this.readSubJson(BookList) || {};
                if (name in json) {
                    delete json[name];
                    await this.writeSubJson(BookList, json);
                    const list = this.getSub('open').hintArray;
                    if (list) list.splice(list.indexOf(name), 1);
                    return this.success();
                }
                return this.fail('Bookmark name is not exists: ' + name);
            }
        },
    };

    async init () {
        // ! 同时操作会报错
        await this.createSoftwareDir();
        await this.createSoftwareFile('book_list');
    }

    async main () {
        return this.noMainCommand();
    }
}

