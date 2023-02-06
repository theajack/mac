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
import { toast } from './ui/components/common/toast/toast';

async function main () {
    const os = await createOS();
    initUI();
    initDevHelper(os);
}

function initDevHelper (os: OS) {
    if (!Context.isDev) return;
    log(os);
    (window as any).os = os;
    (window as any).dev = {
        ...Context,
        async clearAppConfig () {
            (await os.disk.findFileByPath(`${StringText.appDir}/${StringText.appConfigFile}`))?.remove();
        },
        clear () {
            os.disk.clear();
            location.reload();
        },
        toast (content = 'Some content', duration = 3000) {
            toast({
                from: this.getApps()[0],
                title: 'New Message',
                content,
                buttonText: 'Button',
                duration
            });
        }
    };
}

main();