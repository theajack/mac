/*
 * @Author: tackchen
 * @Date: 2022-09-04 17:02:40
 * @Description: Coding something
 */
import { Component } from 'vue';

export interface IJson <T = any> {
    [string: string]: T
}

export interface IApp {
    name: string;
    icon: string;

    url?: string; // for iframe use
    mounted?: boolean; // for insert dom
    vueComponent?: Component; // vue use
}