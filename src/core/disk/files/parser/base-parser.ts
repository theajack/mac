/*
 * @Author: tackchen
 * @Date: 2022-10-01 23:33:41
 * @Description: Coding something
 */

import { TWriteType } from '../../saver/reader';

export class BaseParser {
    parse (content: TWriteType): string | object | null {
        return content;
    }

    parseWrite (content: TWriteType): TWriteType {
        return content;
    }

    // eslint-disable-next-line
    merge (before: TWriteType, content: TWriteType): TWriteType {
        return before;
    }
}