/*
 * @Author: chenzhongsheng
 * @Date: 2025-02-18 21:34:32
 * @Description: Coding something
 */

import Eveit from 'eveit';

// todo 当有新事件加入时 请在下面加入声明
// @ts-ignore
export const DiskEvent = new Eveit<{ // EEvent
    'disk-dir-change': [string[]];
}>();

DiskEvent.usePrevEmit = true;