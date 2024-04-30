/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 16:12:50
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 23:42:55
 */
import { comp, div, event, text } from 'alins';
import { onTab } from '../command/tab';
import { History } from './components/history';
import { InputItem } from './components/input-item';
import { pushResultError, pushResultItem } from './components/result-item';
import { CommonStyle } from './css/main-css';
import { Editor } from './components/editor';
import { Term } from '../term';

const AppId = '.term-app';

function pushDefaultResult (value: string, term: Term) {
    pushResultItem(value, term, div(
        CommonStyle.SuccessColor,
        text(`Execute command Success: ${value}`)
    ));
}
function Main (term: Term) {
    return comp(() => {
        const onrun = async (value: string) => {
            if (value === '') {
                pushResultItem('', term);
                return;
            }
            const commandReturn = await term.commands.handleCommand(value);
            if (!commandReturn) {
                pushDefaultResult(value, term);
                return;
            }
            const { commandName, success, message, result } = commandReturn;
            if (success) {
                if (commandName === 'clear') return;
                if (result) {
                    pushResultItem(value, term, typeof result === 'string' ? text(result) : result);
                } else {
                    pushDefaultResult(value, term);
                }
            } else {
                pushResultError(value, term, message);
            }
        };
        return [
            comp(History),
            InputItem(term)(event({ onrun, ontab: onTab })),
        ];
    });
}

export function App (term: Term) {
    return () => {
        return div(
            AppId,
            div.if(term.global.Edit.enabled)(
                Editor(term)
            ).else(
                Main(term),
            )
        );
    };
}