import type { App } from '../apps/app';

/*
 * @Author: tackchen
 * @Date: 2022-10-04 21:48:42
 * @Description: Coding something
 */
export interface ISelectItem {
    name?: string;
    hotKey?: string[]; // 快捷键
    icon?: string;
    tip?: string; //
    isSplit?: boolean;
    checked?: boolean;
    disabled?: boolean;
    isSearch?: boolean;
    onClick?: (item: ISelectItem) => void;
    onSearchInput?: (text: string) => void;
    children?: ISelectItem[];
}


export type ISelectList = ISelectItem[] & {
    proxy: () => ISelectItem[]
}