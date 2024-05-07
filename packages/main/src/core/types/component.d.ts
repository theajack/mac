
/*
 * @Author: tackchen
 * @Date: 2022-10-04 21:48:42
 * @Description: Coding something
 */

export interface ISelectCondition {
    locked: boolean;
    allFolder: boolean;
    allFiles: boolean;
    selectedCount: number;
    names: string[];
    inTrash: boolean;
    trashTop: boolean;
}

export interface ISelectItem {
    id?: string;
    name?: string;
    nameCreator?: ((config: ISelectCondition)=>string);
    hotKey?: string[]; // 快捷键
    icon?: string;
    tip?: string; //
    isSplit?: boolean;
    checked?: boolean;
    isSearch?: boolean;
    onClick?: (item: ISelectItem) => void;
    onSearchInput?: (text: string) => void;
    children?: ISelectItem[];
    hidden?: boolean;
    isHidden?(options: ISelectCondition): boolean;
    disabled?: boolean;
    isDisabled?(options: ISelectCondition): boolean;
}


export type ISelectList = ISelectItem[] & {
    proxy: () => ISelectItem[]
}