/*
 * @Author: tackchen
 * @Date: 2022-10-04 21:48:42
 * @Description: Coding something
 */
export interface ISelectItem {
    name: string;
    hotKey?: string[];
    icon?: string;
    tip?: string;
    isSplit?: boolean;
    checked?: boolean;
    disabled?: boolean;
    isSearch?: boolean;
    onClick?: () => void;
    onSearchInput?: (text: string) => void;
    children?: ISelectItem[];
}
