/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:29:42
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 08:43:55
 */
import { splitTwoPart } from '../utils/utils';
import { IJson } from 'webos-disk';
import { CDCommand } from './commands/cd';
import { ClearCommand } from './commands/clear';
import { Command, ICommandResult } from './commands/command-base';
import { LSCommand } from './commands/ls';
import { PWDCommand } from './commands/pwd';
import { MkdirCommand } from './commands/mkdir';
import { TouchCommand } from './commands/touch';
import { VimCommand } from './commands/vim';
import { CatCommand } from './commands/cat';
import { RmCommand } from './commands/rm';
import { CpCommand } from './commands/cp';
import { PingCommand } from './commands/ping';
import { HelpCommand } from './commands/help';
import { FindCommand } from './commands/find';
import { getApplications } from './applications/applications';
import { Term } from '../term';

const CommandClassList: (typeof Command)[] = [
    ClearCommand,
    LSCommand,
    CDCommand,
    PWDCommand,
    MkdirCommand,
    TouchCommand,
    VimCommand,
    CatCommand,
    RmCommand,
    CpCommand,
    PingCommand,
    HelpCommand,
    FindCommand,
    ...getApplications()
];

export class CommandManager {
    static List: CommandManager[] = [];

    private commands: IJson<Command> = {};

    private commandList: Command[] = [];

    term: Term;

    constructor (term: Term) {
        this.term = term;
        CommandClassList.forEach(c => this.addNewCommand(c));
    }

    getCommand (name: string) {
        return this.commands[name];
    }

    destory () {
        CommandManager.List.splice(CommandManager.List.indexOf(this), 1);
    }

    addNewCommand (command: typeof Command) {
        // @ts-ignore
        const item = new command(this.term) as Command;
        // ? 可能这里异步会有问题
        item.init().then(() => {
            item.initSubCommands();
        });
        this.commands[item.commandName] = item;
        this.commandList.push(item);
        return item;
    }

    getCommandInfos () {
        return this.commandList.map(command => {
            return {
                commandName: command.commandName,
                help: command.help,
                desc: command.desc,
            };
        });
    }
    getCommandNames () {
        return this.commandList.map(command => (command.commandName));
    }
    async handleCommand (value: string): Promise<ICommandResult> {
        const [ name, args ] = splitTwoPart(value.trim(), ' ');
        // console.log('Command: ' + name, args);
        if (!this.commands[name]) {
            return {
                success: false,
                message: `command not found: ${name}`,
                commandName: name,
                args: [],
                result: null,
            };
        }
        return this.commands[name].run(args.split(' '));
    }

    async executeCommand (command: string) {
        const result = await this.handleCommand(command);
        return result;
    }

    static installCommand (command: typeof Command) {
        for (const manager of CommandManager.List) {
            CommandClassList.push(command);
            manager.addNewCommand(command);
        }
    }

    static getAllCommands () {
        return CommandClassList;
    }
}