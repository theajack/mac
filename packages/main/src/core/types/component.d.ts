import type { SelectType } from '../enum';

/*
 * @Author: tackchen
 * @Date: 2022-10-04 21:48:42
 * @Description: Coding something
 */
export interface ISelectItem {
    id?: string;
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
    type?: SelectType | SelectType[];
}


export type ISelectList = ISelectItem[] & {
    proxy: () => ISelectItem[]
}