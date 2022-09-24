/*
 * @Author: tackchen
 * @Date: 2022-09-21 15:05:05
 * @Description: Coding something
 */
export function trimPath (path: string): string {
    if (!path) return path;
    if (path === '/') return '';

    if (path[0] === '/') path = path.substr(1);
    if (path[path.length - 1] === '/') path = path.substr(0, path.length - 1);
    return path;
}