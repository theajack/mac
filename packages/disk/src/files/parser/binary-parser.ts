/*
 * @Author: tackchen
 * @Date: 2022-10-01 23:32:15
 * @Description: Coding something
 */
import { u8sToString } from '../../lib/utils';
import { BaseParser } from './base-parser';

export class BinaryParser extends BaseParser<Uint8Array> {
    matcher (mimetype: string) {
        return mimetype === '';
    }

    async readParse (u8s: Uint8Array) {
        return u8s;
    }

    async writeParse (content: Uint8Array) {
        return content;
    }

    async readRawString (u8s: Uint8Array) {
        return u8sToString(u8s);
    }
}