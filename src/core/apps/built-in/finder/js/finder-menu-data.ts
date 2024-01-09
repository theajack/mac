/*
 * @Author: chenzhongsheng
 * @Date: 2024-01-06 23:36:59
 * @Description: Coding something
 */

let start = 7;
const Pos = {
    AirDrop: start,
    Timer: start += 31,
    App: start += 31,
    Folder: start += 30,
    Desktop: start += 93,
    File: start += 31,
    Download: start += 30,
};

export interface IFindMenuItem {
    name: string,
    posY?: number,
    color?: string,
    border?: string,
}

// todo 一部分数据存储到fileSystem
export const faviList: IFindMenuItem[] = [
    {
        name: 'HomeDir',
        posY: Pos.Folder,
    },
    {
        name: 'AirDrop',
        posY: Pos.AirDrop,
    },
    {
        name: 'Recents',
        posY: Pos.Timer,
    },
    {
        name: 'Applications',
        posY: Pos.App,
    },
    {
        name: 'Desktop',
        posY: Pos.Desktop,
    },
    {
        name: 'Documents',
        posY: Pos.File,
    },
    {
        name: 'Downloads',
        posY: Pos.Download,
    },
];

export const iCloudList: IFindMenuItem[] = [
    {
        name: 'iCloud Drive',
        posY: 0,
    },
    {
        name: 'Shared',
        posY: 25,
    },
];

export const tagList: IFindMenuItem[] = [
    {
        name: 'Red',
        color: '#ff5c53',
    },
    {
        name: 'Orange',
        color: '#faa513',
    },
    {
        name: 'Yellow',
        color: '#ffe118',
    },
    {
        name: 'Green',
        color: '#35db51',
    },
    {
        name: 'Blue',
        color: '#1c97ff',
    },
    {
        name: 'Purple',
        color: '#d771ff',
    },
    {
        name: 'Gray',
        color: '#92949b',
    },
    {
        name: 'All',
        color: 'transparent',
        border: '#92949b',
    },
];