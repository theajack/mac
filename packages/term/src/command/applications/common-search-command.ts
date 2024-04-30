/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-04 00:21:49
 */

import { Term } from '../../../../term';
import { Command } from '../commands/command-base';

export class CommonSearchCommand extends Command {

    replace: (query: string) => string;

    constructor (term: Term, name: string, replace: (query: string) => string) {
        super(term);
        this.commandName = name;
        this.desc = 'Search with ' + name;
        this.replace = replace;
    }

    async main (args: string[]) {
        window.open(this.replace(args.join(' ')));
        return this.success();
    }
}