/*
import component from '../../../shims.d';
 * @Author: chenzhongsheng
 * @Date: 2023-12-24 09:18:55
 * @Description: Coding something
 */

export interface IHeaderBtnStatus {
    active?: boolean;
    disabled?: boolean;
}

export type IHeaderBtns = {
    gap: number;
} & {
    [key in 'close' | 'min' | 'full']: IHeaderBtnStatus;
};

export interface IWindowHeaderOptions {
    title?: string,
    component?: any,
    buttons?: Partial<IHeaderBtns>;
    height?: number,
    bgColor?: string,
    enable?: boolean,
}

export class WindowHeader {
    id = 0;
    title = 'Window';
    buttons: IHeaderBtns = {} as any;
    bgColor = '#38343c88';
    height = 28;
    enable = true;
    component = undefined as any;

    constructor (options: {
        id: number,
    } & IWindowHeaderOptions) {
        options.buttons = Object.assign({
            min: {},
            close: {},
            full: {},
            gap: 10,
        }, options.buttons);
        Object.assign(this, options);
    }
}