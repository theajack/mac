/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 18:37:32
 * @Description: Coding something
 */

// import { div } from 'alins';
import { $, div, mounted, text } from 'alins';
import { EditorStyle } from '../../ui/css/main-css';
import { Color } from '../../ui/css/styles/atoms';
import type { File } from 'webos-disk';
import { catFile } from '../commands/cat';
import { Command } from '../commands/command-base';
import { Application } from 'webos-module';

// console.log(Application);

// (window as any).app = new Application({
//     code: `
// import * as Loadsh from 'loadsh';
// console.log(Loadsh);
// const arr = [1,2,3]
// console.log(Loadsh.fill(arr, 1))
//     `,
//     onLoaded: (entry) => {
//         // console.log(entry);
//         // (window as any).entry = entry;
//     },
//     iifeNameMap: {
//         'alins': 'Alins',
//         'vue': 'Vue',
//     },
//     onDependenciesParsed (graph) {
//         // console.log('【graph】：', graph);
//     },
//     onProgress (progress) {
//         // console.log('【onProgress】：', progress);
//     }
// });

function createConsole (container: HTMLElement) {
    const common = (color: any) => {
        return (...args: any[]) => {
            const str = args.map(item => {
                return typeof item === 'string' ? item : JSON.stringify(item);
            }).join('\n');
            div(text(str), color).mount(container);
        };
    };
    return {
        log: common(Color.Gray),
        error: common(Color.Fail),
        warn: common(Color.Warn),
        info: common(Color.Blue),
        table: common(Color.Gray),
        clear: () => {
            container.innerHTML = '';
        },
    };
}


export class RunCommand extends Command {
    commandName = 'run';
    desc = 'run js file, use console to log result';
    get help (): string {
        return this.commandName + ' <filename>';
    }

    async main (args: string[]) {
        const target = await catFile(args, this.curDir);

        if (!target) return this.fail('Target is not exist');
        if (target.isDir) return this.fail('Target is not a file');

        const file = target as File;

        const content = await file.readText();

        if (!content) {
            return this.success('File content is Empty!');
        }

        const runningTitle = $('Process: ');
        const runningInfo = $('Initializing...');
        const dot = $('');

        const interval = setInterval(() => {
            dot.value = dot.value.length === 3 ? '' : dot.value + '.';
        }, 500);

        let index = 0;
        const timeStart = Date.now();

        const container = div(
            div(Color.Success, text(`Running: ${file.path.path}`)),
            div(Color.Blue, text($`${runningTitle} ${runningInfo}${dot}`)),
            div(
                EditorStyle.join({ minHeight: 'auto' }),
                text(content + '')
            ),
            div(mounted(dom => {
                new Application({
                    code: `${content}`,
                    env: { console: createConsole(dom) },
                    onProgress: ({ current, url, status, fromCache, parent }) => {
                        if (parent !== 'ROOT' && status === 'start' && !fromCache) {
                            runningInfo.value = `Loading [${++index}][${current}](${url})`;
                        }
                    },
                    // iifeNameMap: { vue: 'Vue' },
                    onLoaded: () => {
                        runningTitle.value = `Done![Installed ${index} new packages in ${Date.now() - timeStart}ms]`;
                        runningInfo.value = '';
                        dot.value = '';
                        clearInterval(interval);
                    }
                });
                // new Function('console', 'process', '' + file.content)(createConsole(dom), process);
            }))
        );
        return this.success(container);
    }
}
