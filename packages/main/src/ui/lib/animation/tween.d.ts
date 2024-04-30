/*
 * @Author: chenzhongsheng
 * @Date: 2023-02-10 11:50:17
 * @Description: Coding somethin
 */

declare class Tween {
    constructor(data: any);
    to(d: any, time: number): Tween;
    easing(d: any): Tween;
    onUpdate(callback: (data: any)=>void): Tween;
    onComplete(callback: ()=>void): Tween;
    start(): Tween;
    chain(...args: Tween[]): Tween
}

interface EasingCommon {
    In: (k: any) => number;
    Out: (k: any) => number;
    InOut: (k: any) => number;
}

declare const TWEEN: {
    Easing: {
        Linear: {
            None: (k: any) => any;
        };
        Quadratic: EasingCommon;
        Cubic: EasingCommon;
        Quartic: EasingCommon;
        Quintic: EasingCommon;
        Sinusoidal: EasingCommon;
        Exponential: EasingCommon;
        Circular: EasingCommon;
        Elastic: EasingCommon;
        Back: EasingCommon;
        Bounce: EasingCommon;
    }
    Tween: typeof Tween;
    update(time: number): void;
};
export default TWEEN;