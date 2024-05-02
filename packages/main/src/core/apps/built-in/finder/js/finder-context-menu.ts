/*
 * @Author: chenzhongsheng
 * @Date: 2024-01-09 18:45:22
 * @Description: Coding something
 */
import { getOS } from '@/core/os/os';
import type { ISelectItem } from '@/core/types/component';
import { checkContextCheckList, createSortByMenu } from '@/ui/components/common/context-menu/context-menu';
import { underDevelopment } from '@/ui/components/common/toast/toast';
import { useFinderStore } from './finder-store';
import { FileUtils, type Dir } from 'webos-term';

const onClick = () => {
    underDevelopment();
};

function getFinderStore () {
    const id = getOS().currentWindow!.id;
    return useFinderStore(id);

}

async function getFinderCurDir (path: string): Promise<Dir> {
    const os = getOS();
    return await os.disk.findDirByPath(path) as Dir;
}

export const MainFinderMenu: ISelectItem[] = [
    {
        name: 'New Folder ✅',
        async onClick () {
            const store = getFinderStore();
            const path = store.getCurPath();
            const dir = await getFinderCurDir(path);
            const name = FileUtils.ensureFileRepeatName('untitled_folder', dir.children);
            const newDir = await dir.createDir({ name });
            await store.refreshDirInfo();

            store.chooseSingleFile(newDir!.id);
            store.editFile();
        },
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
        name: 'Rename ✅',
        onClick () {
            getFinderStore().editFile();
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