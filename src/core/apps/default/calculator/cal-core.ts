/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-23 23:27:32
 * @Description: Coding something
 */
export function createCalculator () {

    const acChangeList: ((v: boolean)=>void)[] = [];
    const setAC = (v: boolean) => {
        acChangeList.forEach(f => {f(v);});
    };

    const signChangeList: ((v: string)=>void)[] = [];
    const setCurSign = (v: string) => {
        signChangeList.forEach(f => {f(v);});
    };

    const E = 'empty';

    let queue: (string)[] = [ E ];

    const modSign = (v: string) => {
        if (queue.length > 1) {
            queue[queue.length - 2] = v;
            setCurSign(v);
        }
    };

    function latest (): string {
        return queue[queue.length - 1] || E;
    }
    const empty = () => queue.length === 0;
    const update = (v: string) => queue[queue.length - 1] = v;

    const calMap = {
        '+': (a: number, b: number) => a + b,
        '-': (a: number, b: number) => a - b,
        '×': (a: number, b: number) => a * b,
        '÷': (a: number, b: number) => a / b,
    };

    const calculate = () => {
        if (queue.length < 4) return;

        const [ a, s1, b, s2 ] = queue;

        if (s1 === '=') {
            queue.splice(0, 2);
            return;
        }

        // @ts-ignore
        let v = calMap[s1](parseFloat(a), parseFloat(b));
        // 去除精度问题
        v = parseFloat(v.toFixed(12));
        setText(v);

        queue = [ v.toString(), s2 ];

        setCurSign('');
    };

    let text = '0';
    const changeList: ((v: string)=>void)[] = [];

    const setText = (v: string|number) => {
        if (typeof v === 'number') v = v.toString();
        text = v;
        changeList.forEach(f => {f(text);});
        setAC(false);
        return v;
    };

    const modValue = (fn: (v:string)=>(number|string)) => {
        if (!empty()) {
            if (latest() === E) {
                const v = queue[0];
                if (v && v !== E) {
                    queue[0] = fn(v).toString();
                    setText(queue[0]);
                }
            } else {
                update((fn(latest())).toString());
                setText(latest());
            }
        }
    };

    const input = (v: string) => {
        switch (v) {
            case '+/-': {
                modValue((v) => (-parseFloat(v)));
            } break;
            case '%': {
                modValue((v) => (parseFloat(v) / 100));
            } break;
            case 'C': {
                if (latest() !== E) {
                    modValue(() => E);
                    setText('0');
                }
                setAC(true);
            } break;
            case 'AC': {
                setText('0');
                queue = [ E ];
                setCurSign('');
            } break;
            case '=': {
                if (latest() === E) return;
                queue.push('=');
                calculate();
                queue.push(E);
                setCurSign(v);
            } break;
            default: {
                if (/^[\+\-×÷]$/.test(v)) {
                    if (latest() === E) {
                        modSign(v);
                        return;
                    }
                    queue.push(v);
                    calculate();
                    queue.push(E);
                    setCurSign(v);
                } else if (/^[\d\.]$/.test(v)) {
                    const value = latest();
                    if (value === E) {
                        if (v === '.') setText('0.');
                        else setText(v);
                    } else if (value === '0') {
                        if (v === '0') break;
                        if (v === '.') setText(text + v);
                        else setText(v);
                    } else {
                        setText(text + v);
                    }
                    update(text);
                } else {
                    throw 'Wrong value:' + v;
                }
            } break;
        }
    };

    return {
        text,
        input,
        onChange (fn: (v: string)=>void) {
            changeList.push(fn);
        },
        onCurSign (fn: (v: string)=>void) {
            signChangeList.push(fn);
        },
        onClearChange (fn: (v: boolean)=>void) {
            acChangeList.push(fn);
        },
    };
}