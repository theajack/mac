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
            title: '',
            width: 250,
            height: 'auto',
            headerBgColor: 'transparent',
            enableResize: false,
            marginTop: 0,
        });
    }
}