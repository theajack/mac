/*
 * @Author: tackchen
 * @Date: 2022-10-01 23:32:36
 * @Description: Coding something
 */

import { IJson } from '../../type';
import { decodeU8sToText, encodeTextToU8s, parseJson } from '../../lib/utils';
import { BaseParser } from './base-parser';

export class JsonParser extends BaseParser<IJson> {

    matcher (mimetype: string, filename: string) {
        return filename.endsWith('.json');
    }

    async readParse (u8s: Uint8Array) {
        return parseJson(decodeU8sToText(u8s)) || {};
    }

    async writeParse (content: IJson) {
        return encodeTextToU8s(JSON.stringify(content));
    }

    async readRawString (u8s: Uint8Array) {
        return JSON.stringify(this.readParse(u8s), null, 4);
    }
}