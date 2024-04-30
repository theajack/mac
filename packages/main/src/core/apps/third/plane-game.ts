/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-27 15:38:34
 * @Description: Coding something
 */
// import { AppNames, createEmptyStatus } from '../app-config';
// import { getHost } from '@/lib/utils';
// import { App } from '../app';

// export class PlaneGame extends App {
//     statusMenu = createEmptyStatus('Plane Game');
//     constructor () {
//         super({
//             // title: 'Plane Game',
//             name: AppNames.planeGame,
//             link: `https://${getHost()}/type`,
//             // url: `https://${getHost()}/type`,
//         });
//     }
// }

import { WebApp } from '../web-app';
import { AppNames, createEmptyStatus } from '../app-config';
import { getHost } from '@/lib/utils';

export class PlaneGame extends WebApp {
    statusMenu = createEmptyStatus('Plane Game');
    constructor () {
        super({
            title: 'Plane Game',
            name: AppNames.planeGame,
            url: `https://${getHost()}/type`,
        });
    }
}