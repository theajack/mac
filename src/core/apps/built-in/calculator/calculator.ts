/*
 * @Author: tackchen
 * @Date: 2022-09-22 10:11:01
 * @Description: Coding something
 */
import { App } from '../../app';
import { AppNames } from '../../app-config';
import CalculatorUI from './calculator.vue';

export class Calculator extends App {

    constructor () {
        super({
            name: AppNames.calculator
        });
    }

    onOpen (): void {
        this.openNewWindow({
            component: CalculatorUI,
            width: 250,
            height: 'auto',
            header: {
                enable: false,
            },
            enableResize: false,
        });
    }
}