/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-04 00:20:16
 */

import { Term } from '../../../../term';
import { CommonSearchCommand } from './common-search-command';
export class BaiduCommand extends CommonSearchCommand {
    constructor (term: Term) {
        super(
            term,
            'baidu',
            (query: string) => `https://www.baidu.com/s?wd=${query}`
        );
    }
}