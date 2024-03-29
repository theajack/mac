/*
 * @Author: tackchen
 * @Date: 2022-10-07 20:48:25
 * @Description: Coding something
 */

import type { ISelectItem } from '../types/component';
import { toast } from '@/ui/components/common/toast/toast';
import { getApps } from '../context';

const onClick = function (this: ISelectItem) {
    toast({
        from: getApps()[0],
        title: 'New Message',
        content: this.name || '',
        buttonText: 'Button'
    });
};

export const mainStatus: ISelectItem[] = [
    {
        name: 'About This Mac',
        onClick
    }, {
        isSplit: true,
    }, {
        name: 'System Preferences...',
        onClick
    }, {
        name: 'App Store...',
        onClick,
    }, {
        isSplit: true
    }, {
        name: 'Recent Items',
        onClick,
        children: [ {
            name: 'test1',
            onClick,
        }, {
            name: 'test2',
            onClick,
        } ]
    }, {
        isSplit: true
    }, {
        name: 'Force Quit...',
        onClick,
    }, {
        isSplit: true
    }, {
        name: 'Sleep',
        onClick,
    }, {
        name: 'Restart...',
        onClick,
    }, {
        name: 'Shut Down...',
        onClick,
    }, {
        isSplit: true
    }, {
        name: 'Lock Screen',
        onClick,
    }, {
        name: 'Log Out tackchen...',
        onClick,
    }
];