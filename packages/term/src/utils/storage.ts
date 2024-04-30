/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-11 06:57:03
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-11 06:59:42
 */

import { parseJSON } from './utils';

const tail = '_webos_';
const store = window.localStorage;

function geneKey (key: string) {
    return key + tail;
}

function write (key: string, value: any) {
    const type = typeof value;
    if (type === 'object') {
        value = JSON.stringify(value);
    } else if (type !== 'string') {
        value = value.toString();
    }
    store.setItem(geneKey(key), `${type}:${value}`);
}

function parseValue (value: any) {
    if (value === null) {
        return null;
    }
    const splitIndex = value.indexOf(':');
    let type = 'string';
    if (splitIndex !== -1) {
        const readType = value.substr(0, splitIndex);
        if ([ 'string', 'number', 'boolean', 'object', 'undefined' ].indexOf(readType) !== -1) {
            type = readType;
            value = value.substr(splitIndex + 1);
        }
    }
    if (type === 'number') {
        return parseFloat(value);
    } if (type === 'boolean') {
        return value === 'true';
    } if (type === 'object') {
        return parseJSON(value);
    }
    return value;
}

function read (key: string) {
    const value = store.getItem(geneKey(key));
    return parseValue(value);
}

export const Storage = {
    read (key: string) {
        return read(key);
    },
    write (key: string, value: any) {
        return write(key, value);
    },
    remove (key: string) {
        return store.removeItem(key);
    },
};
