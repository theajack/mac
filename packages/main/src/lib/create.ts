/*
 * @Author: tackchen
 * @Date: 2022-09-25 22:08:50
 * @Description: Coding something
 */
export function createLoadedChecker (
    count: number, onloaded: () => void
) {
    let loadedNumber = 0;
    return () => {
        loadedNumber ++;
        // console.warn('checkLoaded', path, loadedNumber, files.length);
        if (loadedNumber >= count) {
            onloaded();
        }
    };
}