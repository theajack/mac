/*
 * @Author: chenzhongsheng
 * @Date: 2024-05-03 22:33:48
 * @Description: Coding something
 */
export enum StopEvents {
    WindowResize
}

export function matchStopEvent (e: Event, type: StopEvents) {
    // @ts-ignore
    return e.target?.dataset?.eventStop === `${type}`;
}