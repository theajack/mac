/*
 * @Author: tackchen
 * @Date: 2022-10-01 23:32:36
 * @Description: Coding something
 */

import { parseJson } from '@/lib/utils';
import { BaseParser } from './base-parser';

export class JsonParser extends BaseParser {
    parse (content: string): object | null {
        return parseJson(content);
    }
}