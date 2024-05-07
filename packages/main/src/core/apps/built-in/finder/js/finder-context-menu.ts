/*
 * @Author: chenzhongsheng
 * @Date: 2024-01-09 18:45:22
 * @Description: Coding something
 */
import type { ISelectItem } from '@/core/types/component';
import { checkContextCheckList, createSortByMenu } from '@/ui/components/common/context-menu/context-menu';
import { underDevelopment } from '@/ui/components/common/toast/toast';
import { FinderUtils } from './finder-utils';
import { getOS } from '@/core/os/os';
import type { FileBase } from 'webos-term';
import type { Trash } from '../../trash';
import { callApp } from '@/core/apps/app';
import { AppNames } from '@/core/apps/app-config';

const onClick = () => {
    underDevelopment();
};

const trashCommonExec = async (
    fn: (trash: Trash, files: FileBase[])=>Promise<void>,
    selectFiles = true
) => {
    const files = selectFiles ? await FinderUtils.getSelectedFiles() : [];
    await fn(getOS().appManager.trash, files);
    await FinderUtils.getStore()!.refreshDirInfo();
};

const EmptyTrashItem = () => ({
    name: 'Empty Trash ✅',
    isHidden: ({ inTrash }) => !inTrash,
    async onClick () {
        await trashCommonExec(trash => trash.emptyTrash(), false);
    }
});

export const MainFinderMenu: ISelectItem[] = [
    {
        name: 'New Folder ✅',
        isHidden ({ inTrash }) {
            return inTrash;
        },
        async onClick () {
            await FinderUtils.newFile(true);
        },
    },
    {
        name: 'New File ✅',
        isHidden ({ inTrash }) {
            return inTrash;
        },
        async onClick () {
            await FinderUtils.newFile();
        },
    },
    EmptyTrashItem(),
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
        name: 'Move to Trash ✅',
        isHidden: ({ locked }) => locked,
        async onClick () {
            await trashCommonExec((trash, files) => trash.recycleFiles(files));
        }
    },
    {
        name: 'Put Back ✅',
        isHidden: ({ trashTop }) => !trashTop,
        async onClick () {
            await trashCommonExec((trash, files) => trash.putFilesBack(files));
        }
    },
    {
        name: 'Delete Immediately... ✅',
        isHidden: ({ inTrash }) => !inTrash,
        async onClick () {
            await trashCommonExec((trash, files) => trash.deleteFiles(files));
        }
    },
    EmptyTrashItem(),
    {
        isSplit: true,
    },
    {
        name: 'Get Info',
        onClick,
    },
    {
        name: 'Rename ✅',
        isHidden ({ locked, selectedCount, inTrash }) {
            return (selectedCount > 1 || locked || inTrash);
        },
        onClick () {
            FinderUtils.editFile();
        }
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
] as ISelectItem[];

export const FolderMenu: ()=>ISelectItem[] = () => [
    {
        name: 'Open in New Tab ✅',
        isHidden: ({ allFolder }) => !allFolder,
        async onClick () {
            const files = await FinderUtils.getSelectedFiles();
            const finder = getOS().appManager.finder;
            for (const file of files) {
                callApp({
                    name: AppNames.finder,
                    from: finder,
                    data: {
                        path: file.pathString,
                    }
                });
            }
        }
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


export const FileMenu: ()=>ISelectItem[] = () => [
    {
        name: 'Open',
        isHidden: ({ allFiles }) => !allFiles,
        onClick,
    },
    {
        name: 'Open With',
        isHidden: ({ allFiles }) => !allFiles,
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