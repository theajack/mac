/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 15:46:56
 * @Description: Coding something
 */
import {
    compressToEncodedURIComponent,
} from 'lz-string';

export function compressString (str: string): string {
    return compressToEncodedURIComponent(str);
}