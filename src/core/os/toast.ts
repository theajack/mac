/*
 * @Author: tackchen
 * @Date: 2022-09-21 22:18:49
 * @Description: Coding something
 */
import { IApp } from '../apps/type';

export class Toast {
    parent: IApp;
    title: string;
    content: string;

    constructor ({
        parent,
        title,
        content,
    }: {
        parent: IApp;
        title: string;
        content: string;
    }) {
        this.parent = parent;
        this.title = title || parent.name;
        this.content = content;
    }
}