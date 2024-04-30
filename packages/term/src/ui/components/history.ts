/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 16:23:31
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-12 20:06:06
 */

import { click, comp, div } from 'alins';
import { style } from 'alins-style';
import { LastLogin } from './last-login';

export const HistoryClass = '.term-histoy';

export function History () {
    return div(HistoryClass,
        click.stop,
        style.color('#bbb').lineHeight(20),
        comp(LastLogin)
    );
}