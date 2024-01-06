/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-27 15:38:34
 * @Description: Coding something
 */
import { WebApp } from '../web-app';
import { AppNames, createEmptyStatus } from '../app-config';
import { getHost } from '@/lib/utils';

export class BomberMan extends WebApp {
    statusMenu = createEmptyStatus('Bomber Man');
    constructor () {
        super({
            title: 'Bomber Man',
            name: AppNames.bomberman,
            url: `https://${getHost()}/bombbattle`,
        });
    }
}