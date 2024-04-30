/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-17 08:19:08
 * @Description: Coding something
 */
import 'whatwg-fetch';

export async function fetchText (url: string) {
    const data = await fetch(url);
    return (data.ok) ? await data.text() : '';
}
export async function fetchJson (url: string) {
    const data = await fetch(url);
    return (data.ok) ? await data.json() : null;
}

export function isNpmRoot (url: string) {
    // if (url.includes('@vue')) debugger;
    return /^https:\/\/cdn\.jsdelivr\.net\/npm\/[a-z\-]+\/?$/.test(url)
        || /^https:\/\/cdn\.jsdelivr\.net\/npm\/\@[a-z\-]+\/[a-z\-]+\/?$/.test(url);
}

export function isSubNpmModuleName (url: string) {
    return /^\@[a-z\-]+\/[a-z\-]+\/?$/.test(url);
}

export function pickNpmRootUrl (url: string) {
    return pickNpmFromUrl(url, 1);
}

export function pickNpmPackageName (url: string) {
    return pickNpmFromUrl(url, 2);
}

function pickNpmFromUrl (url: string, index: number) {
    const result = url.match(/^(https:\/\/cdn\.jsdelivr\.net\/npm\/(([a-z\-]+)|(@[a-z\-]+\/[a-z\-]+)))((\/.*?)|$)/);
    if (!result) return '';

    return result[index];
}