/*
 * @Author: tackchen
 * @Date: 2022-10-01 23:32:36
 * @Description: Coding something
 */

import { parseJson } from '@/lib/utils';
import { BaseParser } from './base-parser';

export class JsonParser extends BaseParser {
    parse (content: string | object): object | null {
        if (typeof content === 'object') return content;
        return parseJson(content);
    }
    parseWrite (content: string | object): string {
        if (typeof content === 'object') return JSON.stringify(content);
        return content;
    }
    merge (before: object, content: object): object {
        return Object.assign(before, content);
    }
}