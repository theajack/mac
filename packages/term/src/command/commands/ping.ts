/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-20 13:15:28
 */

import { $, div, text } from 'alins';
import { style } from 'alins-style';
import { Color } from '../../ui/css/styles/atoms';
import { Command } from './command-base';

function pingUrlRequest (value: string, onresult: ()=>void) {

    const url = value.indexOf('http') === 0 ? value : `https://${value}`;
    const client = new XMLHttpRequest();
    client.open('get', url, true);
    try {
        client.send();
    } catch (e) {
    }
    client.onreadystatechange = function () {
        if (client.readyState === 4) {
            onresult();
        }
    };
}

function pingResult (value: string) {

    const content = $(`ping ${value}`);
    const color = $(Color.Blue._result.color as string);
    let dot = '';

    const time = Date.now();
    const interval = setInterval(() => {
        if (dot.length < 3) dot += '.';
        else dot = '';
        content.value = `ping ${value}${dot}`;
        if (Date.now() - time > 5000) {
            content.value = `ping ${value} Timeout! time=${Date.now() - time}ms`;
            color.value = Color.Fail._result.color as string;
            clearInterval(interval);
        }
    }, 500);

    pingUrlRequest(value, () => {
        content.value = `ping ${value} success! ttl=${Date.now() - time}ms`;
        color.value = Color.Success._result.color as string;
        clearInterval(interval);
    });

    return div(style.color(color), text(content));
}

export class PingCommand extends Command {
    commandName = 'ping';
    desc = 'Ping url address';
    get help () {
        return this.commandName + ' <url address>';
    }

    async main (args: string[]) {
        const value = args[0];

        if (!value) return this.fail('Ping targer is Empty!');


        return this.success(pingResult(value));
    }
}
