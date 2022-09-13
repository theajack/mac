/*
 * @Author: tackchen
 * @Date: 2022-09-11 07:58:38
 * @Description: Coding something
 */
export function countStringBytes (str: string): number {
    let totalLength = 0;
    let i;
    let charCode;
    for (i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i);
        if (charCode < 0x007f) {
            totalLength = totalLength + 1;
        } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
            totalLength += 2;
        } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
            totalLength += 3;
        }
    }
    return totalLength;
}
export function uuid () {
    const s: any[] = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);

    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = '-';
    s[13] = '-';
    s[18] = '-';
    s[23] = '-';
    const uuid = s.join('');
    return uuid;
}

export function timeId () {
    return Date.now().toString().substring(3) + random(100000, 999999);
}

export function random (a: number, b: number) {
    return (a + Math.round(Math.random() * (b - a)));
}