/*
 * @Author: tackchen
 * @Date: 2022-10-04 00:00:55
 * @Description: Coding something
 */

import { charSplitToSpaceSplit, importScript } from '@/lib/utils';
import { toast } from '@/ui/components/common/toast/toast';
import { getApps } from '../context';
import type { IJson } from '../type';
import type { ISelectItem } from '../types/component';
import type { App } from './app';
import { AppStore } from './built-in/app-store';
import { Finder } from './built-in/finder/finder';
import { SystemPreferences } from './built-in/prefer';
import { Terminal } from './built-in/terminal';
import { Trash } from './built-in/trash';
import { Calculator } from './built-in/calculator/calculator';
import { Launcher } from './built-in/launcher';
import { Safari } from './built-in/safari/safari';
import { Notes } from './built-in/notes';
import { Siri } from './built-in/siri';
import { Github } from './built-in/github';
import { Vscode } from './third/vscode';
import { Bilibili } from './third/bilibili';
import { Meitu } from './third/meitu';
import { WeChat } from './third/wechat';
import { KWai } from './third/kwai';
import { QQMusic } from './third/qqmusic';
import type { IAppStatusTitle } from './type';

export enum AppNames {
    finder = 'finder',
    systemPreferences = 'system-preferences',
    trash = 'trash',
    appStore = 'app-store',
    terminal = 'terminal',
    calculator = 'calculator',
    launcher = 'launcher',
    notes = 'notes',
    safari = 'safari',
    siri = 'siri',

    // 三方App
    github = 'github',
    vscode = 'vscode',
    bilibili = 'bilibili',
    meitu = 'meitu',
    wechat = 'wechat',
    kwai = 'kwai',
    qqmusic = 'qqmusic',
}

export const DefaultApps: {
    [key in AppNames]: typeof App
} = {
    [AppNames.finder]: Finder,
    [AppNames.systemPreferences]: SystemPreferences,
    [AppNames.trash]: Trash,
    [AppNames.appStore]: AppStore,
    [AppNames.terminal]: Terminal,
    [AppNames.calculator]: Calculator,
    [AppNames.launcher]: Launcher,
    [AppNames.safari]: Safari,
    [AppNames.notes]: Notes,
    [AppNames.siri]: Siri,
    // 三方App
    [AppNames.github]: Github,
    [AppNames.bilibili]: Bilibili,
    [AppNames.meitu]: Meitu,
    [AppNames.vscode]: Vscode,
    [AppNames.wechat]: WeChat,
    [AppNames.qqmusic]: QQMusic,
    [AppNames.kwai]: KWai,
};

export function createDefaultApps ():
    {[prop in AppNames]: IAppConfig}
{
    let dockIndex = 1;

    const app = (name: AppNames) => ({
        name, dockIndex: dockIndex++
    });

    return {
        [AppNames.github]: app(AppNames.github),
        [AppNames.launcher]: app(AppNames.launcher),
        [AppNames.terminal]: app(AppNames.terminal),
        [AppNames.safari]: app(AppNames.safari),
        [AppNames.calculator]: app(AppNames.calculator),
        [AppNames.wechat]: app(AppNames.wechat),
        [AppNames.vscode]: app(AppNames.vscode),
        [AppNames.meitu]: app(AppNames.meitu),
        [AppNames.bilibili]: app(AppNames.bilibili),
        [AppNames.qqmusic]: app(AppNames.qqmusic),
        [AppNames.kwai]: app(AppNames.kwai),
        [AppNames.finder]: app(AppNames.finder),
        [AppNames.appStore]: app(AppNames.appStore),
        [AppNames.notes]: app(AppNames.notes),
        [AppNames.siri]: app(AppNames.siri),
        [AppNames.systemPreferences]: app(AppNames.systemPreferences),
        [AppNames.trash]: { name: AppNames.trash, dockIndex: 1000 },
    };
}

export function appNameToTitle (name: string): string {
    return charSplitToSpaceSplit(name, '-');
}

export interface IAppConfig {
    name: string;
    dockIndex?: number;
    isDefault?: boolean;
    url?: string; // 从cdn加载的app
}


export const InnerApps: IJson<typeof App> = {
};

export async function createApp (config: IAppConfig) {

    const name = config.name;
    // @ts-ignore
    let AppClass = DefaultApps[name] || InnerApps[name];
    if (AppClass) {
        return new AppClass();
    }

    if (!config.url) return null;

    await importScript(config.url);

    AppClass = window.__THIRD__APPS__[name];
    if (!AppClass) throw new Error();
    return new AppClass();
}


function onClick (this: ISelectItem) {
    toast({
        from: getApps()[0],
        title: 'New Message',
        content: this.name || '',
        buttonText: 'Button'
    });
}

function createEmptyStatusItem (title = '') {
    return {
        title,
        children: [ {
            name: 'There is nothing...',
            onClick,
        }, {
            isSplit: true,
        }, {
            name: 'Still under development',
            onClick,
        } ]
    };
}

export function createEmptyStatus (title: string): IAppStatusTitle[] {
    // todo
    return [
        createEmptyStatusItem(title),
        createEmptyStatusItem('File'),
        createEmptyStatusItem('Edit'),
        createEmptyStatusItem('View'),
        createEmptyStatusItem('Go'),
        createEmptyStatusItem('Window'),
        createEmptyStatusItem('Help'),
    ];
}