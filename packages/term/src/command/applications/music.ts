/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-04 00:22:58
 */
import { Term } from '../../../../term';
import { CommonSearchCommand } from './common-search-command';
export class MusicCommand extends CommonSearchCommand {
    constructor (term: Term) {
        super(
            term,
            'music',
            (query: string) => `https://music.163.com/#/search/m/?s=${query}`
        );
    }
}