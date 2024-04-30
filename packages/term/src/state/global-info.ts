/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 16:32:05
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 23:18:47
 */
import { $, value } from 'alins';
import { focusToEnd } from '../utils/utils';

export function createGlobalData () {

    const userName = $('admin');

    const currentDirName = $('');

    const inputContent = $('');

    const Hint = (() => {
        const state = $({
            text: '',
            list: [],
            enabled: false,
        });
        return {
            get text () {return state.text;},
            get enabled () {return state.enabled;},
            get list () {return state.list;},
            setHint (v: string, list: string[]) {
                state.text = v;
                state.enabled = true;
                state.list[value] = list;
            },
            hideHint () {
                state.enabled = false;
            }
        };
    })();

    const Edit = (() => {
        const state = $({
            enabled: false,
            content: '',
            filepath: '',
            touch: false, // 是否是新建文件
        });


        return {
            get enabled () {
                return state.enabled;
            },
            get content () {
                return state.content;
            },

            get filepath () {
                return state.filepath;
            },
            get touch () {
                return state.touch;
            },

            enterEdit (path: string, content: string, touch = false) {
                state.content = content;
                state.filepath = path;
                state.enabled = true;
                state.touch = touch;

                focusToEnd(document.querySelector('#Editor'));
            },
            quitEdit () {
                state.content = '';
                state.enabled = false;

                (document.querySelector('#InputInput') as any)?.focus();
            }
        };
    })();

    return {
        userName,
        currentDirName,
        inputContent,
        Hint,
        Edit,
    };
}

