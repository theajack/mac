/*
 * @Author: chenzhongsheng
 * @Date: 2023-02-08 23:15:17
 * @Description: Coding something
 */
export const MenuHeight = 40;

export const MenuHeightStr = `${MenuHeight}px`;

export const CommonMargin = 5;

// 扩展坞的上边高
export const DockTop = 72 + CommonMargin;

export let WindowHeight = window.innerHeight;

// export const WindowHeightStr = `${WindowHeight}px`;

export let WindowWidth = window.innerWidth;

export let WinHeightNoDock = WindowHeight - DockTop;

// export const WindowWidthStr = `${WindowWidth}px`;

window.addEventListener('resize', () => {
    WindowHeight = window.innerHeight;
    WindowWidth = window.innerWidth;
    WinHeightNoDock = WindowHeight - DockTop;
});