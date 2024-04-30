/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-20 12:16:30
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-29 16:54:30
 */

import { ensureInputIsVisible } from '../ui/components/input-item';
import { onTab } from './tab';
import { Term } from '../../../term';

let hintTimer: any = null;

export function clearHitTimer () {
    clearTimeout(hintTimer);
}

export function onHint (getValue: ()=>string, term: Term) {
    clearHitTimer();
    hintTimer = setTimeout(async () => {
        const value = getValue();
        const [ name, subName ] = value.split(' ');
        const command = term.commands.getCommand(name);
        const item = (subName && command) ? command.subCommands[subName] : null;
        if (item && typeof item  === 'object' && value.split(' ').length === 3) {
            const list = item.hintArray || await getHintList(value, term);
            const text = item.help || (command ? command.help : '');
            term.global.Hint.setHint(text, list);
        } else {
            const list = await getHintList(value, term);
            const text = command ? command.help : '';
            term.global.Hint.setHint(text, list);
        }
        ensureInputIsVisible(term.container);
    }, 500);

}

export async function getHintList (value: string, term: Term): Promise<string[]> {
    return await onTab(value, term, true);
}