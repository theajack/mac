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
import { AppStore } from './default/app-store';
import { Finder } from './default/finder';
import { SystemPreferences } from './default/prefer';
import { Terminal } from './default/terminal';
import { Trash } from './default/trash';
import type { IAppStatus } from './type';
import { Calculator } from './default/calculator/calculator';
import { Launcher } from './default/launcher';
import { Safari } from './default/safari';
import { Notes } from './default/notes';
import { Siri } from './default/siri';

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
};

export function createDefaultApps ():
    {[prop in AppNames]: IAppConfig}
{
    let dockIndex = 1;
    return {
        [AppNames.finder]: { name: AppNames.finder, dockIndex: dockIndex++ },
        [AppNames.launcher]: { name: AppNames.launcher, dockIndex: dockIndex++ },
        [AppNames.appStore]: { name: AppNames.appStore, dockIndex: dockIndex++ },
        [AppNames.notes]: { name: AppNames.notes, dockIndex: dockIndex++ },
        [AppNames.safari]: { name: AppNames.safari, dockIndex: dockIndex++ },
        [AppNames.siri]: { name: AppNames.siri, dockIndex: dockIndex++ },
        [AppNames.systemPreferences]: { name: AppNames.systemPreferences, dockIndex: dockIndex++ },
        [AppNames.terminal]: { name: AppNames.terminal, dockIndex: dockIndex++ },
        [AppNames.calculator]: { name: AppNames.calculator, dockIndex: dockIndex++ },
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

    if (!config.url) throw new Error();

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
            name: 'Still in developing',
            onClick,
        } ]
    };
}

export function createEmptyStatus (): IAppStatus {

    return {
        dock: createEmptyStatusItem('Finder'),
        list: [
            createEmptyStatusItem('Finder'),
            createEmptyStatusItem('File'),
            createEmptyStatusItem('Edit'),
            createEmptyStatusItem('View'),
            createEmptyStatusItem('Go'),
            createEmptyStatusItem('Window'),
            createEmptyStatusItem('Help'),
        ]
    };
}