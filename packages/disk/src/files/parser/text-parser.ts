/*
 * @Author: tackchen
 * @Date: 2022-10-01 23:32:15
 * @Description: Coding something
 */
import { decodeU8sToText, encodeTextToU8s } from '../../lib/utils';
import { BaseParser } from './base-parser';

export class TextParser extends BaseParser<string> {

    matcher (mimetype: string) {
        return (mimetype.startsWith('text/'));
    }

    async readParse (u8s: Uint8Array) {
        return decodeU8sToText(u8s);
    }

    async writeParse (content: string) {
        return encodeTextToU8s(content);
    }
}