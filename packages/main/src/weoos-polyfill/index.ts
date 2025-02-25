
const _decoder = new TextDecoder();
const _encoder = new TextEncoder();

export function decodeU8sToText (u8s: Uint8Array): string {
    return _decoder.decode(u8s);
}

export function encodeTextToU8s (str: string): Uint8Array {
    return _encoder.encode(str);
}
export function parseJson (str: string): object | null {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}
