/*
 * @Author: tackchen
 * @Date: 2022-10-04 00:00:55
 * @Description: Coding something
 */

import { IJson } from '../type';

export interface IAppConfig {
    name: string;
    isDefault?: boolean;
    url?: string; // 从cdn加载的app
}

export function createDefaultApps (): IJson<IAppConfig> {
    return {
        finder: {
            name: 'finder',
        }
    };
}