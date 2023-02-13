/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:33:13
 * @Description: Coding something
 */
import { createAnimation } from './animation';

interface IStyle {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    skew?: number;
    range?: number;
    rangRight?: number;
    zIndex: number;
}

interface ISize {
    width: number;
    height: number;
}

class ClipPoints {
    count = 20;

    addon: number[] = [];

    constructor () {
        this.initAddon();
    }

    genePoints (range: number, rangeRight: number) {
        const points: {x: number, y: number}[] = [];

        const yPer = 100 / this.count;

        const per = range / this.count;
        const rangeRate = (((range / 40) * 3) ** 2);


        const perRight = rangeRight / this.count;
        const rangeRightRate = (((rangeRight / 40) * 3) ** 2);

        for (let i = 0; i < this.count; i++) {
            const rate = this.addon[i] * rangeRate;
            const point = { x: (per * i) + rate, y: (yPer * i) };
            points.unshift(point);


            const rightRate = - this.addon[i] * rangeRightRate;
            const pointRight = { x: 100 - ((perRight * i) + rightRate), y: (yPer * i) };
            points.push(pointRight);
            // points.push({x: 100 - point.x, y: point.y});
        }

        points.unshift({ x: range, y: 100 });
        points.push({ x: 100 - range, y: 100 });

        return points;
    }

    initAddon () {
        const per = 2 * Math.PI / this.count;
        for (let i = 0; i < this.count; i ++) {
            this.addon.push(- Math.sin(per * i));
        }
    }
}

const PointClipper = new ClipPoints();

const MIDDLE_POINT_RATE = 0.25;


function buildMiddlePoint (
    source: IStyle,
    target: IStyle,
    size: ISize
): IStyle {
    const rate = MIDDLE_POINT_RATE;
    return {
        x: target.x - (target.x - source.x) * rate,
        y: source.y + (target.y - source.y) * rate,
        scaleX: target.scaleX - (target.scaleX - source.scaleX) * rate,
        scaleY: source.scaleY + (target.scaleY - source.scaleY) * rate,
        skew: countSkew(source, target, size),
        range: 35,
        rangRight: 35,
        zIndex: target.zIndex + (target.zIndex - source.zIndex) / 2
    };
}


// target1.skew = countSkew(source, target, size);

function countSkew (style1: IStyle, style2: IStyle, size: ISize): number {
    const count = (n1: number, len: number) => n1 + (len) / 2;
    const c1x = count(style1.x, size.width);
    const c1y = count(style1.y, size.height);
    const c2x = count(style2.x, size.width);
    const c2y = count(style2.y, size.height);

    let deg = arcToDeg((c2x - c1x) / (c2y - c1y));

    let abs = Math.abs(deg);
    const sign = Math.sign(abs);
    if (abs > 30) deg = deg + sign * 20;
    abs = Math.abs(deg);
    if (abs > 65) deg = sign * 65;
    return deg;
}

function arcToDeg (arc: number) {
    return Math.atan(arc) / Math.PI * 180;
}


function buildClipPath (range: number, rangrRight: number) {
    const points = PointClipper.genePoints(range, rangrRight);
    const str = points.map(p => `${p.x}% ${p.y}%`).join(',');
    return `polygon(${str})`;
}
export function buildTransform (o: {x: number, y: number, scaleX: number, scaleY: number, skew: number}) {
    return `translate(${o.x}px, ${o.y}px) scaleX(${(o.scaleX / 100).toFixed(2)}) scaleY(${(o.scaleY / 100).toFixed(2)}) skew(${o.skew}deg, 0deg)`;
}

export function createDockAnimation (
    dom: HTMLElement,
    source: IStyle,
    target: IStyle,
    size: ISize,
    onComplete: () => void
) {
    if (!source.skew) source.skew = 0;
    if (!source.rangRight) source.rangRight = 0;
    if (!source.range) source.range = 0;

    if (!target.skew) target.skew = 0;
    if (!target.rangRight) target.rangRight = 0;
    if (!target.range) target.range = 0;

    const middlePoint = buildMiddlePoint(source, target, size);

    const originSource = Object.assign({}, source);

    const onUpdate = (data: any) => {
        dom.style.zIndex = data.zIndex;
        dom.style.transform = buildTransform(data);
        dom.style.clipPath = buildClipPath(data.range, data.rangRight);
    };

    createAnimation({
        list: [ source, middlePoint, target ],
        onUpdate,
        onComplete () {
            onComplete();
        },
        time: 500,
    });

    return (x: number, onComplete?: ()=>void) => {

        target.x = x;

        const middlePoint = buildMiddlePoint(originSource, target, size);

        createAnimation({
            list: [ target, middlePoint, originSource ],
            onUpdate,
            onComplete () {
                onComplete?.();
            },
            time: 500,
        });
    };
}

