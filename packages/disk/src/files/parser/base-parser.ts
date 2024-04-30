/*
 * @Author: tackchen
 * @Date: 2022-10-01 23:33:41
 * @Description: Coding something
 */

import { mergeU8s, u8sToString } from '../../lib/utils';


export abstract class BaseParser<T> {

    constructor () {}

    abstract matcher(mimetype: string, filename: string): boolean;

    abstract readParse (u8s: Uint8Array): Promise<T>;

    abstract writeParse (content: T): Promise<Uint8Array>;

    async readRawString (u8s: Uint8Array): Promise<string> {
        return u8sToString(u8s);
    }

    async mergeContent (content: T, origin: Uint8Array): Promise<Uint8Array> {
        return mergeU8s(
            origin,
            await this.writeParse(content)
        );
    }

    // // eslint-disable-next-line
    // abstract merge (before: TWriteType, content: TWriteType): TWriteType;
}