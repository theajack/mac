
/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-17 08:16:47
 * @Description: Coding something
 */
import hex_md5 from './md5';
import { NPMLoader } from './npm-loader';
import { transformCode } from './babel';
import { Application } from './application';

// 缓存 url - Module
const ModuleMap: Record<string, Module> = {};

export function getModuleMap () {
    return ModuleMap;
}

type TModuleType = 'name' | 'code' | 'url';

export type TModuleErrorType = 'transform'|'exec';

export type TModuleLoaded = (module: Module) => void;

export interface IModuleProgressPart {
    status: 'start' | 'fail' | 'done';
    fromCache?: boolean;
}
export interface IModuleProgressOptions extends IModuleProgressPart{
    parent: string;
    current: string;
    url: string;
}

export type TModuleProgress = (options:  IModuleProgressOptions) => void;

export type TModuleExecuted = (module: Module) => void;

export interface IErrorOptions {
    module: Module;
    error: any;
    type: TModuleErrorType;
}

export interface IMoudleOptions extends IMouduleFunc {
    name: string,
    parent?: Module | null,
    type?: TModuleType,
    app: Application,
}

interface IMouduleFunc {
    onLoaded?: TModuleLoaded,
    onExecuted?: TModuleExecuted,
}

export class Module {
    app: Application;

    name: string = '';
    type: TModuleType;
    parent: Module | null;
    func: IMouduleFunc = {};
    // url = '';

    code: string = '';
    imports: string[] = [];
    dependencies: Record<string, Module> = {};

    exports: any = null;
    npmLoader: NPMLoader;

    private _url: string = '';

    time = 0;

    private startTime: number = 0;

    get url () {
        return this._url || this.npmLoader.url;
    }

    get MainMap () {
        return this.app.options.mainMap || {};
    }

    get IIFENameMap () {
        return this.app.options.iifeNameMap || {};
    }

    get Env () {
        return this.app.options.env;
    }

    constructor ({
        app,
        name,
        parent = null,
        onLoaded,
        onExecuted,
        type = 'name',
    }: IMoudleOptions) {
        this.startTime = Date.now();
        this.app = app;

        this.type = type;

        this.func = { onLoaded, onExecuted };

        this.parent = parent;

        if (parent === null || type === 'code') {
            this.name = 'CODE';
            this._url = `CODE:md5=${hex_md5(name)}`;
            this.code = name;
        } else {
            this.name = name;
            if (type === 'name') {
                this.npmLoader = new NPMLoader(this, parent.url, name);
            } else {
                this._url = name;
            }
        }

        const module = ModuleMap[this.url];

        if (module) {
            this.onProgress({ status: 'start', fromCache: true });
            // console.warn(`【module loaded from cache ${this.url}】name=${this.name}`);
            this.func.onLoaded?.(module);
            this.onProgress({ status: 'done', fromCache: true });
            return module;
        }

        ModuleMap[this.url] = this;

        this.loadCode();
    }

    onProgress ({
        status, fromCache = false,
    }: IModuleProgressPart): void {
        this.app.options.onProgress?.({
            parent: this.parent?.name || 'ROOT',
            current: this.name,
            url: this.url,
            status,
            fromCache,
        });
    }

    async loadCode () {
        this.onProgress({ status: 'start' });
        if (this.name === 'CODE') {
            this.onCode(this.code);
            this.onProgress({ status: 'done' });
            return;
        }
        const code = await this.npmLoader.fetch();
        this.onCode(code);
        this.onProgress({ status: !!code ? 'done' : 'fail' });
    }
    get fromNpm () {
        if (!this.npmLoader) return false;
        return this.npmLoader.fromNpm();
    }

    private emitError (error: any, type: TModuleErrorType) {
        const item = { error, type, module: this };
        this.app._onError(item);
        throw new Error(error);
    }

    onCode (originCode: string, fromCache = false) {
        const { code, imports, error } = transformCode(originCode, !this.fromNpm);
        if (error) {
            this.emitError(error, 'transform');
        }

        // console.warn(`【module loaded start ${imports.length}】name=${this.name}`);
        // if (imports.length > 0) debugger;

        this.code = code;
        this.imports = imports;
        const length = imports.length;

        if (length === 0) {
            !fromCache && this.onModuleLoaded();
            return;
        }

        let loadedNum = 0;
        const onloaded = (name: string, module: Module) => {
            loadedNum ++;
            // console.warn(`【loaded single】${name}: url=${this.url}; ${loadedNum}/${this.imports.length}`);
            // console.warn(this.imports.toString());
            this.dependencies[name] = module;
            if (loadedNum >= length && !fromCache) {
                this.onModuleLoaded();
            }
        };

        // for (const name of imports) {
        for (let i = 0; i < length; i++) {
            const name = imports[i];
            // console.warn('xxmodule load', i, name);
            // ! 22
            this.dependencies[name] = new Module({
                app: this.app,
                name,
                parent: this,
                onLoaded: (module) => {
                    // console.warn('xxmodule loaded', i, name);
                    onloaded(name, module);
                },
                type: this.checkType(name)
            });
        }
    }

    onModuleLoaded () {
        this.time = Date.now() - this.startTime;
        this.startTime = 0;
        // console.warn(`【module loaded ${this.imports.length}】name=${this.name}`);
        this.func.onLoaded?.(this);
    }

    checkType (name: string) {
        if (name.startsWith('https://') || name.startsWith('http://')) return 'url';
        return 'name';
    }

    run (map: Record<string, any>) {
        if (!map[this.url]) {
            const exports = {};
            const module = { exports };
            const require = (name: string) => {
                const module = this.dependencies[name];
                if (!module) throw new Error(`Module ${name} not found`);
                return module.run(map);
            };
            let returnCode = 'return module.exports;';

            // if (this.url === 'https://cdn.jsdelivr.net/npm/vue/index.js') {
            //     returnCode = 'debugger;' + returnCode;
            //     debugger;
            // }
            const umd = this.IIFENameMap[this.name];
            if (umd) {
                // ! 增加 default 属性
                returnCode = `window.${umd}=${umd}; if(${umd}.__esModule && !${umd}.default){${umd}.default=${umd};} return ${umd};`;
            }

            let names: string[] = [];
            let values: any[] = [];
            if (this.Env) {
                names = Object.keys(this.Env);
                values = Object.values(this.Env);
            }
            try {
                const moduleExports = new Function(
                    'require', 'exports', 'module', ...names,
                    `return (function(require, exports, module){${this.code};\n ${returnCode}})(require, exports, module);`
                )(require, exports, module, ...values);

                // ! 补齐default
                if (moduleExports.__esModule && !moduleExports.default) {
                    moduleExports.default = moduleExports;
                }
                map[this.url] = moduleExports;
                this.func.onExecuted?.(this);
                this.app.options.onModuleExecuted?.(this);
            } catch (e) {
                // console.warn('执行失败', this.code, e);
                this.emitError(e, 'exec');
                // map[this.url] = null;
            }

            // if (this.url === 'https://cdn.jsdelivr.net/npm/vue/index.js') {
            //     debugger;
            // }
        }
        this.exports = map[this.url];
        return this.exports;
    }

    buildDependenciesGraph (): Record<string, object> {
        const graph: Record<string, object> = {};
        const ds = this.dependencies;
        for (const k in ds) {
            graph[k] = ds[k].buildDependenciesGraph();
        }
        return graph;
    }
}
