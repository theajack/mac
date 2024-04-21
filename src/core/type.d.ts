/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:10:46
 * @Description: Coding something
 */

export interface IJson<T = any> {
    [prop: string]: T
}

export interface ISize {
    width: number;
    height: number;
}

export interface IPosition {
    left: number;
    top: number;
}

export interface IPos {
    x: number;
    y: number;
}