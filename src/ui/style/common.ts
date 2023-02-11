/*
 * @Author: chenzhongsheng
 * @Date: 2023-02-08 23:15:17
 * @Description: Coding something
 */
export const MenuHeight = 40;

export const MenuHeightStr = `${MenuHeight}px`;

export let WindowHeight = window.innerHeight;

// export const WindowHeightStr = `${WindowHeight}px`;

export let WindowWidth = window.innerWidth;

// export const WindowWidthStr = `${WindowWidth}px`;

window.addEventListener('resize', () => {
    WindowHeight = window.innerHeight;
    WindowWidth = window.innerWidth;
});