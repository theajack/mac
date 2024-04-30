/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-17 08:48:58
 * @Description: Coding something
 */

import type { IErrorOptions, TModuleExecuted, TModuleLoaded, TModuleProgress } from './module';
import { Module } from './module';

export interface IApplicationOptionsBase {
    env?: Record<string, any>;
    iifeNameMap?: Record<string, string>;
    mainMap?: Record<string, string>;
    onLoaded?: TModuleLoaded,
    onDependenciesParsed?(graph: Record<string, object>): void;
    onProgress?: TModuleProgress;
    onError?: (options: IErrorOptions)=>void;
    onModuleExecuted?: TModuleExecuted;
    onExecuted?: ()=>void;
    onStart?: (code: string) => void;
    onEnd?: (code: string) => void;
}

export interface ICodeQueueItem {
    code: string;
    resolve: (module: Module)=>void;
    reject: (err: IErrorOptions)=>void;
}

export interface IApplicationOptions extends IApplicationOptionsBase {
    code?: string,
}

export class Application {
    entry: Module;
    code: string;
    // 缓存 url - module 执行的结果
    ModuleExportsMap: Record<string, any> = {};
    onDependenciesParsed?(graph: Record<string, object>): void;

    options:IApplicationOptionsBase = {};

    reject: ((err: IErrorOptions)=>void)|null = null;

    private codeQueue: ICodeQueueItem[] = [];
    private inExecuting = false;

    constructor (options: IApplicationOptions = {}) {

        if (!options.env) {options.env = {};}

        const defaultProcess = { env: { NODE_ENV: 'production', OS: 'webos' }, argv: [] };

        if (!options.env.process) { options.env.process = defaultProcess;}
        else {Object.assign(options.env.process, defaultProcess);}

        this.options = options;

        if (options.code) {
            this.exec(options.code);
        }
    }

    private addIntoQueue (item: ICodeQueueItem) {
        this.codeQueue.push(item);
    }

    async exec (code: string) {
        return new Promise((resolve, reject) => {
            const item = { code, resolve, reject };
            if (this.inExecuting) {
                this.addIntoQueue(item);
                return;
            }
            this.execBase(item);
        });
    }

    private execBase ({ code, resolve, reject }: ICodeQueueItem) {
        this.code = code;
        this.inExecuting = true;
        this.options.onStart?.(code);
        this.reject = reject;
        this.ModuleExportsMap = {}; // ! 重新运行时需要清空map
        this.entry = new Module({
            app: this,
            name: code,
            type: 'code',
            onLoaded: (module) => {
                this.onDependenciesParsed?.(
                    module.buildDependenciesGraph()
                );
                module.run(this.ModuleExportsMap);
                this.options.onLoaded?.(module);
                resolve(module);
                this._onEnd();
            },
            onExecuted: () => {
                this.options.onExecuted?.();
            },
        });
    }

    private executeNext () {
        const item = this.codeQueue.shift();
        if (item) this.execBase(item);
    }

    _onError (err: IErrorOptions) {
        this.options.onError?.(err);
        this.reject?.(err);
        this._onEnd();
    }

    private _onEnd () {
        this.inExecuting = false;
        this.reject = null;
        this.executeNext();
        this.options.onEnd?.(this.code);
    }
}

