/*
 * @Author: tackchen
 * @Date: 2022-10-04 00:00:55
 * @Description: Coding something
 */

import { charSplitToSpaceSplit, importScript } from '@/lib/utils';
import { IJson } from '../type';
import { App } from './app';
import { AppStore } from './default/app-store';
import { Finder } from './default/finder';
import { SystemPreferences } from './default/prefer';
import { Trash } from './default/trash';

export enum AppNames {
    finder = 'finder',
    systemPreferences = 'system-preferences',
    trash = 'trash',
    appStore = 'app-store',
}

export const DefaultAppNames = [
    AppNames.appStore, AppNames.finder, AppNames.trash,
    AppNames.systemPreferences
] as const;

export type TDefaultApps = (typeof DefaultAppNames)[number];

export function appNameToTitle (name: string): string {
    return charSplitToSpaceSplit(name, '-');
}

export interface IAppConfig {
    name: string;
    dockIndex?: number;
    isDefault?: boolean;
    url?: string; // 从cdn加载的app
}

export const DefaultApps: IJson<typeof App> = {
    [AppNames.finder]: Finder,
    [AppNames.systemPreferences]: SystemPreferences,
    [AppNames.trash]: Trash,
    [AppNames.appStore]: AppStore,
};

export const InnerApps: IJson<typeof App> = {
};

export async function createApp (config: IAppConfig) {

    const name = config.name;
    let AppClass = DefaultApps[name] || InnerApps[name];
    if (AppClass) {
        return new AppClass();
    }

    if (!config.url) throw new Error();

    await importScript(config.url);

    AppClass = window.__THIRD__APPS__[name];
    if (!AppClass) throw new Error();
    return new AppClass();
}

export function createDefaultApps ():
    {[prop in TDefaultApps]: IAppConfig}
{
    return {
        [AppNames.finder]: { name: AppNames.finder, dockIndex: 1 },
        [AppNames.appStore]: { name: AppNames.appStore, dockIndex: 2 },
        [AppNames.systemPreferences]: { name: AppNames.systemPreferences, dockIndex: 3 },
        [AppNames.trash]: { name: AppNames.trash, dockIndex: 1000 },
    };
}