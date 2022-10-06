/*
 * @Author: tackchen
 * @Date: 2022-10-03 15:30:44
 * @Description: Coding something
 */
import { App } from '../app';
import { AppNames } from '../app-config';
import { IAppStatus } from '../type';

const status: IAppStatus = {
    dock: {
        title: 'Finder',
        children: []
    },
    list: [
        {
            title: 'Finder',
            children: []
        }, {
            title: 'File',
            children: []
        }, {
            title: 'Edit',
            children: []
        }, {
            title: 'View',
            children: []
        }, {
            title: 'Go',
            children: []
        }, {
            title: 'Window',
            children: []
        }, {
            title: 'Help',
            children: []
        }
    ]
};

export class Finder extends App {

    constructor () {
        super({
            name: AppNames.finder,
            status,
        });
    }
}