/*
 * @Author: tackchen
 * @Date: 2022-09-22 10:11:01
 * @Description: Coding something
 */
import { App } from '../../app';
import { AppNames } from '../../app-config';
import CalculatorUI from './calculator.vue';
import { markRaw } from 'vue';

export class Calculator extends App {

    newWindowOptions = markRaw({
        component: CalculatorUI,
        width: 250,
        height: 'auto' as const,
        header: {
            enable: false,
        },
        enableResize: false,
        background: 'var(--bg-gray-light)'
    });

    constructor () {
        super({
            name: AppNames.calculator,
            msgCount: 1,
        });
    }

    openNewWindow () {
        this.msgCount = 0;
        return super.openNewWindow();
    }
}