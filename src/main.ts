/*
 * @Author: tackchen
 * @Date: 2022-09-10 22:08:00
 * @Description: Coding something
 */
import { createOS, OS } from './core/os/os';
import { StringText } from './core/string';
import { log } from './lib/utils';
import { initUI } from './ui';
import * as Context from './core/context';

async function main () {
    const os = await createOS();
    initUI();
    initDevHelper(os);
}

function initDevHelper (os: OS) {
    if (location.host.indexOf('localhost:') !== 0) return;
    log(os);
    (window as any).os = os;
    (window as any).dev = {
        ...Context,
        clearAppConfig () {
            os.disk.findFileByPath(`${StringText.appDir}/${StringText.appConfigFile}`)?.remove();
        },
        clear () {
            os.disk.clear();
            location.reload();
        }
    };
}

main();