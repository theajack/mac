/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 16:18:02
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-03 00:03:01
 */
import { comp, div, prop, slot, text } from 'alins';
import { style } from 'alins-style';
import { Term } from '../../term';
import { Color } from '../css/styles/atoms';
import { HistoryClass } from './history';
import { HistoryInputItem } from './input-item';

const ResultItem = comp(({ slots }) => {
    return div(
        style.marginBottom(10).wordWrap('break-word'),
        slots
    );
});


export function pushResultItem (inputValue: string, term: Term, resultSlots?: any) {
    comp(() => [
        HistoryInputItem(term)(prop({ inputValue })),
        resultSlots ? ResultItem(slot(resultSlots)) : null
    ]).mount(term.container.querySelector(HistoryClass) as HTMLElement);
}

export function pushResultError (value: string, term: Term, message: string) {
    pushResultItem(value, term, div(Color.Fail, text(message)));
}