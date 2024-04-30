/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-04 00:21:20
 */

import { Term } from '../../../../term';
import { CommonSearchCommand } from './common-search-command';
export class GoogleCommand extends CommonSearchCommand {
    constructor (term: Term) {
        super(
            term,
            'google',
            (query: string) => `https://www.google.com/search?q=${query}`
        );
    }
}