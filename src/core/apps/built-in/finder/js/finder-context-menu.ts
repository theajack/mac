/*
 * @Author: chenzhongsheng
 * @Date: 2024-01-09 18:45:22
 * @Description: Coding something
 */
import type { ISelectItem } from '@/core/types/component';
import { checkContextCheckList, createSortByMenu } from '@/ui/components/common/context-menu/context-menu';
import { underDevelopment } from '@/ui/components/common/toast/toast';

const onClick = () => {
    underDevelopment();
};

export const MainFinderMenu: ISelectItem[] = [
    {
        name: 'New Folder',
        onClick,
    },
    {
        isSplit: true,
    },
    {
        name: 'Get Info',
        onClick,
    },
    {
        isSplit: true,
    },
    {
        name: 'View',
        onClick,
        children: checkContextCheckList([
            {
                name: 'as Icons',
                onClick,
                checked: true,
            },
            {
                name: 'as List',
                onClick,
            },
            {
                name: 'as Columns',
                onClick,
            },
            {
                name: 'as Gallery',
                onClick,
            },
        ])
    },
    {
        name: 'Use Groups',
        onClick,
    },
    {
        name: 'Sort By',
        onClick,
        children: createSortByMenu(),
    },
    {
        name: 'Show View Options',
        onClick,
    },
];

const FileCommonMenu = () => [
    {
        isSplit: true,
    },
    {
        name: 'Move to Trash',
        onClick,
    },
    {
        isSplit: true,
    },
    {
        name: 'Get Info',
        onClick,
    },
    {
        name: 'Rename',
        onClick,
    },
    {
        name: 'Compress "xxx"',
        onClick,
    },
    {
        name: 'Duplicate',
        onClick,
    },
    {
        name: 'Make Alias',
        onClick,
    },
    {
        name: 'Quick Look',
        onClick,
    },
    {
        isSplit: true,
    },
    {
        name: 'Copy',
        onClick,
    },
    {
        name: 'Share...',
        onClick,
    },
    // {
    //     name: 'Tags...',
    //     onClick,
    // },
    // {
    //     isSplit: true,
    // },
];

export const FolderMenu: ISelectItem[] = [
    {
        name: 'Open in New Tab',
        onClick,
    },
    ...FileCommonMenu(),
    {
        isSplit: true,
    },
    {
        name: 'Folder Actions Setup...',
        onClick,
    },
    {
        name: 'New Terminal at Folder',
        onClick,
    },
    {
        name: 'New Terminal Tab at Folder',
        onClick,
    },
];


export const FileMenu: ISelectItem[] = [
    {
        name: 'Open',
        onClick,
    },
    {
        name: 'Open With',
        onClick,
        children: [
            {
                name: 'AA',
                onClick,
            },
            {
                name: 'BB',
                onClick,
            },
        ]
    },
    ...FileCommonMenu(),
];