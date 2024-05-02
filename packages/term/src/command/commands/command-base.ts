import type { Term } from '../../term';
import { parseJSON } from '../../utils/utils';
import type { Dir, File, IJson } from 'webos-disk';
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:39:27
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-02 20:21:54
 */
export interface ICommandResult {
    success: boolean;
    error?: any;
    message: string;
    commandName: string;
    args: string[]
    result: any;
}

type ISubCommandFunc = (this: Command, args: string[]) => Promise<ICommandResult>;

interface ISubCommandObject {
    hint?: 'custom' | 'file' | 'command' | 'none';
    hintArray?: string[];
    help?: string;
    main(this: Command, args: string[], sub: ISubCommandObject): Promise<ICommandResult>;
    init?(this: Command, sub: ISubCommandObject): Promise<void>;
}

export type ISubCommands = IJson<ISubCommandFunc | ISubCommandObject>;

export abstract class Command {

    term: Term;

    commandName = '';
    args: string[] = [];
    subCommands: ISubCommands = {};

    needHint = true;

    get cmdLength () {
        return this.help.replaceAll(/<.*?>/g, 'xx').split(' ').length;
    }

    get subNames () {
        return Object.keys(this.subCommands);
    }

    get curDir () {
        return this.term.currentDir;
    }

    get curPath () {
        return this.term.currentPath;
    }

    get container () {
        return this.term.container;
    }

    desc = '';
    hint: 'custom' | 'file' | 'command' | 'none' = 'file';
    hintArray: string[] = [];

    softwareDir: Dir;

    files: IJson<File> = {};

    constructor (term: Term) {
        this.term = term;
    }

    get help () {
        return this.commandName + ' <filename|filepath>';
    }

    async init () {}

    async run (args: string[]): Promise<ICommandResult> {
        this.args = args;
        const subCommands = Object.keys(this.subCommands);
        if (args.length > 0 && subCommands.includes(this.args[0])) {
            const subCommand = this.args.shift() as string;
            const sub = this.subCommands[subCommand];
            if (typeof sub === 'function') {
                return await sub.call(this, this.args);
            }
            return await sub.main.call(this, this.args, sub);
        } else {
            return this.main(args);
        }
    }
    abstract main (args: string[]): Promise<ICommandResult>;

    success (result: any = null): ICommandResult {
        return {
            commandName: this.commandName,
            args: this.args,
            success: true,
            message: '',
            result,
        };
    }

    fail (message = '', error = null): ICommandResult {
        return {
            commandName: this.commandName,
            args: this.args,
            success: false,
            message,
            error,
            result: null,
        };
    }

    noMainCommand () {
        return this.fail('Please use sub command: ' + this.help);
    }


    async createSoftwareDir (name = this.commandName) {
        this.softwareDir = await this.term.disk.createChildByPath(`/System/Command/${name}`, true, true) as Dir;
    }
    async createSoftwareFile (name: string) {
        if (!name) throw new Error('File name is Empty: ' + name);
        if (name in this.files) throw new Error('File is already exists: ' + name);
        this.files[name] = await this.term.disk.createChildByPath(`/System/Command/${this.commandName}/${name}`, false, true) as File;
        return this.files[name];
    }

    initSubCommands () {
        if (Object.keys(this.subCommands).length > 0) {
            for (const k in this.subCommands) {
                const sub = this.subCommands[k];
                if (typeof sub === 'object' && typeof sub.init === 'function') {
                    sub.init.call(this, sub);
                }
            }
        }
    }

    async readSubJson (name: string) {
        const file = this.files[name];

        if (!file) return null;
        return parseJSON(await file.readText());
    }

    async appendSubJson (name: string, key: string, value: any) {
        const json = await this.readSubJson(name) || {};
        json[key] = value;
        await this.writeSubJson(name, json);
    }
    async writeSubJson (name: string, json: object) {
        await this.files[name]?.writeText(JSON.stringify(json, null, 4));
    }

    getSub (name: string) {
        return (this.subCommands[name] as ISubCommandObject);
    }
}