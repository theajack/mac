/*
 * @Author: tackchen
 * @Date: 2022-10-01 23:32:15
 * @Description: Coding something
 */
import { BaseParser } from './base-parser';

export class TextParser extends BaseParser {
    parse (content: string): string {
        return content;
    }
    parseWrite (content: string): string {
        return content;
    }
    merge (before: string, content: string): string {
        return before + content;
    }
}