/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 09:11:09
 */

// import { div } from 'alins';
import { div, span, text } from 'alins';
import { Color } from '../../ui/css/styles/atoms';
import { Command } from './command-base';

export class HelpCommand extends Command {
    commandName = 'help';
    desc = 'Get help';
    hint: 'command' = 'command';

    get help (): string {
        return this.commandName + ' <command name>';
    }

    async main (args: string[]) {
        const info = this.term.commands.getCommandInfos();

        const name = args[0];

        const result = !!name ? (info.filter(item => item.commandName === name) || []) : info;

        if (result.length === 0) return this.fail('Command Not Found');

        const divs = result.map(item => div(
            '.help-item',
            span('.help-name', item.commandName),
            span('.help-text', item.help),
            span(text(item.desc))
        )) as any;

        divs.unshift(div(
            Color.Blue,
            span('.help-name', 'Name'),
            span('.help-text', 'Useage'),
            span('Description')
        ));

        return this.success(divs);
    }
}
