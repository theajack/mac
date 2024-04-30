/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-21 00:09:58
 * @Description: Coding something
 */
import { Path } from 'webos-path';
import { pureTransformCode } from './babel';
import { Module } from './module';
import { fetchJson, fetchText, isNpmRoot, isSubNpmModuleName, pickNpmPackageName, pickNpmRootUrl } from './utils';

export class NPMLoader {
    parentUrl: string = '';
    name: string = '';
    url: string = '';

    module: Module;

    constructor (module: Module, parentUrl: string, name: string) {
        this.module = module;
        this.parentUrl = parentUrl;
        this.name = name;

        let url = '';

        const map = this.module.MainMap;

        if (name in map) {
            url = `https://cdn.jsdelivr.net/npm/${name}${map[name]}`;
        } else {
            if (name.startsWith('./') || name.startsWith('../')) {
                // xxx/xx.js ./);
                // if (parentUrl.includes('estree-walker')) debugger;

                if (name.startsWith('./')) {
                    if (parentUrl.endsWith('.js')) {
                        name = name.replace('./', '../');
                    }
                } else if (name.startsWith('../')) {
                    name = name.replace('../', '../../');
                }

                url = Path.join(parentUrl, name);
                if (!this.isNpmRoot(url)) {
                    if (!url.endsWith('.js')) url = `${url}.js`;
                }
            } else {
                // 针对直接 'aa/bb' 的情况
                if (
                    !isSubNpmModuleName(name) &&
                    name.includes('/') &&
                    !name.endsWith('.js')
                ) name = `${name}.js`;
                url = `https://cdn.jsdelivr.net/npm/${name}`;
            }
        }

        if (url[url.length - 1] === '/')
            url = url.substring(0, url.length - 1);
        this.url = url;
    }

    static ESModuleList: Set<string> = new Set();

    private async fetchMain () {

        const packageName = pickNpmPackageName(this.url);

        if (this.module.IIFENameMap[packageName]) return '';

        const pkg = await fetchJson(`${this.url}/package.json`);

        if (!pkg) return '';

        if (pkg.main) return pkg.main;

        if (!pkg.module) return ''; // throw new Error(`Invalid Package:${this.url}`);

        NPMLoader.ESModuleList.add(this.url);

        return pkg.module;
    }

    async fetch (): Promise<string> {
        if (!this.isNpmRoot()) return this.fetchCode();
        const main = await this.fetchMain();

        if (!main) return this.fetchCode();

        if (main.endsWith('.js')) {
            return await this.fetchCode(main);
        }

        const maybeDir = (main.endsWith('src') || main.endsWith('dist'));

        const first = maybeDir ? `${main}/index.js` : `${main}.js`;
        const second = maybeDir ? `${main}.js` : `${main}/index.js`;

        const text = await this.fetchCode(first);
        if (text) return text;
        return await this.fetchCode(second);
    }

    private async fetchCode (sub?: string) {
        if (sub) {
            this.url = Path.join(this.url, sub);
        }

        const code = await fetchText(this.url);

        if (this.isES6Module(this.url)) {
            return pureTransformCode(code);
        }
        return code;
    }

    private isES6Module (url: string) {
        const npmRoot = pickNpmRootUrl(url);
        return (npmRoot && NPMLoader.ESModuleList.has(npmRoot));
    }

    isNpmRoot (url = this.url) {
        return isNpmRoot(url);
    }

    fromNpm () {
        return this.url.startsWith('https://cdn.jsdelivr.net/npm/');
    }
}