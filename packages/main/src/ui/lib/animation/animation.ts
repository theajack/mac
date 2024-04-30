/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:33:13
 * @Description: Coding something
 */
import TWEEN from './tween';

export function createAnimation ({
    list,
    onUpdate,
    onComplete,
    time,
}: {
  list: any[],
  onUpdate: (data: any) => void,
  onComplete?: ()=> void,
  time: number,
}) {

    if (!((window as any).___inited_animation)) {
        (window as any).___inited_animation = true;
        const animate = (time: number) => {
            requestAnimationFrame(animate);
            TWEEN.update(time);
        };
        requestAnimationFrame(animate);
    }

    let firstEasing = TWEEN.Easing.Linear.None;
    let secondEasing = TWEEN.Easing.Linear.None;

    if (list.length === 2) {
        firstEasing = TWEEN.Easing.Quadratic.InOut;
    } else if (list.length === 3) {
        firstEasing = TWEEN.Easing.Quadratic.In;
        secondEasing = TWEEN.Easing.Quadratic.Out;
    } else if (list.length <= 1) {
        throw new Error('list length必须大于1');
    }

    const perTime = Math.round( time / (list.length - 1) );

    const source = list.shift();

    const target = list.shift();

    const _update = () => {onUpdate(source);};

    const tween = new TWEEN.Tween(source) // Create a new tween that modifies 'coords'.
        .to(target, perTime) // Move to (300, 200) in 1 second.
        .easing(firstEasing) // Use an easing function to make the animation smooth.
        .onUpdate(_update)
        .chain(
            ...list.map((data, i) => {
                const tween = new TWEEN.Tween(source)
                    .easing(secondEasing)
                    .to(data, perTime)
                    .onUpdate(_update);

                if (onComplete && i === list.length - 1) {
                    tween.onComplete(onComplete);
                }
                return tween;
            })
        )
        .start(); // Start the tween immediately.

    if (onComplete && list.length === 0) {
        tween.onComplete(onComplete);
    }
    return tween;
}
