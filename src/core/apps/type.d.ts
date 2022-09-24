/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:11:26
 * @Description: Coding something
 */

export interface IApp {
    name: string;
    status: IAppStatus;
}

export interface IAppStatusBase {
    name: string;
    hotKey?: string[];
    icon?: string;
    tip?: string;
    checked?: boolean;
    disabled?: boolean;
    isSearch?: boolean;
    onClick?: (data: {app: IApp}) => void;
    onSearchInput?: (data: {app: IApp, text: string}) => void;
}

export interface IAppStatusSingle extends IAppStatusBase {
    children?: IAppStatusBase[];
}

export interface IAppStatus {
    main: IAppStatusSingle;
    [key: string]: IAppStatusSingle;
}

export interface IAppMessageBase {
    to: string;
    data: any;
}

export interface IAppMessage extends IAppMessageBase {
    from?: symbol | string;
}