/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { markRaw } from 'vue';
import { App } from '../../app';
import { AppNames, createEmptyStatus } from '../../app-config';
import TextEditUI from './text-edit.vue';
import { MacEvent } from '@/core/os/event-bus';
import { useTextEditStore } from './text-edit-store';

export class TextEdit extends App {
    statusMenu = createEmptyStatus('TextEdit');

    newWindowOptions = markRaw({
        component: TextEditUI,
        height: 500,
        width: 700,
    });
    constructor () {
        super({
            name: AppNames.textEdit,
            iconScale: true,
        });

        MacEvent.on('new-window', async ({ name, data }) => {
            console.log(name, data);
            if (name === this.name) {
                const window = this.openNewWindow();
                const text = data.content;
                if (typeof text === 'string') {
                    useTextEditStore(window.id).content = text;
                }
            }
        });
    }
}