/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 16:04:45
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-08 00:32:48
 */
import { a, div, text } from 'alins';
import { style } from 'alins-style';
import { Storage } from '../../utils/storage';
import { formatDateTime } from '../../utils/utils';
import { Color } from '../css/styles/atoms';

export function LastLogin () {
    const key = 'last_login';
    const lastLoginTime = Storage.read(key);
    Storage.write(key, formatDateTime());
    return div(
        style.marginBottom(20),
        div(style.marginBottom(5), text(lastLoginTime ? `Last login: ${lastLoginTime}` : 'First Login!')),
        div(
            style.marginBottom(10),
            a('Web-OS', Color.Blue, '[href=https://github.com/theajack/webos][target=_blank]'),
            ' made by ',
            a('theajack', Color.Blue, '[href=https://github.com/theajack][target=_blank]'),
            ', UI is Powered by ',
            a('alins', Color.Blue, '[href=https://github.com/alinsjs/alins][target=_blank]'),
        ),
        div('Use `help` command to Start!'),
    );
}