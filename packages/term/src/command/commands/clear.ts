/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 08:09:28
 */

import { HistoryClass } from '../../ui/components/history';
import { Command } from './command-base';

export class ClearCommand extends Command {
    commandName = 'clear';
    hint: 'none' = 'none';
    desc = 'Clear console';
    get help (): string {
        return this.commandName;
    }

    async main () {
        const history = this.container.querySelector(HistoryClass);
        if (history) {
            history.innerHTML = '';
            return this.success();
        } else {
            return this.fail('history not found');
        }
    }
}
