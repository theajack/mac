/*
 * @Author: tackchen
 * @Date: 2022-09-21 21:09:10
 * @Description: Coding something
 */
import Eveit from 'eveit';

// todo 当有新事件加入时 请在下面加入声明
// @ts-ignore
export const DiskEvent = new Eveit<{ // EEvent
    'disk-dir-change': [string[]];
}>();

DiskEvent.usePrevEmit = true;
