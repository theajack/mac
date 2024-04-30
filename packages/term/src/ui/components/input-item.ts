/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 16:17:58
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-30 16:32:30
 */
import type { IComponentOptions } from 'alins';
import { $, div, input, span, on, mounted, click, comp, text } from 'alins';
import { style } from 'alins-style';
import type { Term } from '../../term';
import { clearHitTimer, onHint } from '../../command/hint';
import { Storage } from '../../utils/storage';
import { CommonStyle } from '../css/main-css';
import { CommonFont } from '../css/styles/atoms';

function createContentHistory () {
    const maxLen = 100;
    const key = 'history';

    const history = Storage.read(key);
    const contentHistory: string[] = history || [];

    let index = contentHistory.length;

    let editHistory: string[] = [];
    editHistory[index] = '';

    return {
        get () {
            const editValue = editHistory[index];
            return typeof editValue == 'string' ? editValue : contentHistory[index];
        },
        prev () {
            if (index > 0) index --;
            return this.get();
        },
        next () {
            const nexti = index + 1;
            if (nexti < contentHistory.length || nexti < editHistory.length) {
                index ++;
            }
            return this.get();
        },
        push (v: string) {
            contentHistory.push(v);
            if (contentHistory.length > maxLen) {
                contentHistory.shift();
            }
            index = contentHistory.length;
            editHistory = [];
            editHistory[index] = '';
            Storage.write(key, contentHistory);
        },
        oninput (v: string) {
            editHistory[index] = v;
        }
    };
}

export function InputItem (term: Term) {
    const ContentHistory = createContentHistory();
    const { inputContent, Hint, currentDirName, userName } = term.global;
    return comp(({ events }: IComponentOptions) => {

        const inputStyle = style.flex(1)
            .outline('none')
            .backgroundColor('transparent')
            .color('#fff')
            .border('none')
            .join(CommonStyle.FontSize)
            .padding(0)
            .fontSize(14)
            .height(20);

        let isInComposition = false;
        let ignoreNextEnter = false;

        const onkeyup = (e: KeyboardEvent, dom: HTMLInputElement) => {
        // console.log(e);
            const code = e.keyCode;
            const value = dom.value.trimStart();
            switch (code) {
                case 9: events.ontab(value, term); break;
                    // case 38:
                    // case 40:{
                    //     const value = ContentHistory[code === 38 ? 'prev' : 'next']();
                    //     // console.log('value', value);
                    //     if (typeof value == 'string') inputContent.value = value;
                    // };break;
                case 13: {
                    if (ignoreNextEnter) {
                        ignoreNextEnter = false;
                        break;
                    }
                    if (value) ContentHistory.push(value);
                    inputContent.value = '';
                    events.onrun(value);
                    setTimeout(() => {ensureInputIsVisible(term.container);}, 0);
                    e.preventDefault();
                    Hint.hideHint();
                } break;
                default: ContentHistory.oninput(value); break;
            }
            onHint(() => dom.value, term);
        };

        const onkeydown = (e: KeyboardEvent) => {
            const code = e.keyCode;

            if (code === 229) { // ! 输入法keydowncode
                if (isInComposition) {
                    ignoreNextEnter = true;
                }
            }
            if ([ 9, 13, 38, 40 ].includes(code)) {
                if (code === 38 || code === 40) {
                    const name = code === 38 ? 'prev' : 'next';
                    const value = ContentHistory[name]();
                    if (typeof value == 'string') inputContent.value = value;
                }
                e.preventDefault();
            }
        };

        return div(
            div(
                style.display('flex'),
                span(
                    '#InputTitle',
                    text($`webos:${currentDirName} ${userName}$`),
                    style.marginRight(9),
                    click.stop
                ),
                input.model(inputContent)(
                    '#InputInput[spellcheck=false][autocomplete=off]',
                    inputStyle, CommonFont,
                    on('keyup')(onkeyup),
                    on('keydown')(onkeydown),
                    on('blur')(() => {
                        clearHitTimer();
                        Hint.hideHint();
                    }),
                    on('compositionstart')(() => {isInComposition = true;}),
                    on('compositionend')(() => {isInComposition = false;}),
                    on('focus')((e, dom) => {onHint(() => dom?.value, term);}),
                    mounted((dom) => {
                        const container = term.container;
                        ((container.tagName === 'BODY') ? window : container).addEventListener('click', (e) => {
                            if (e.target === container) {
                                dom.focus();
                            }
                        }, true);
                    })
                ),
            ),
            div.show(Hint.enabled)(
                style.color('#777').marginTop(5),
                span.show(() => !!Hint.text.value)(text($`Hint: ${Hint.text}`)),
                div(
                    style.wordBreak('break-word'),
                    span.for(Hint.list)(item => [
                        style.marginRight(20),
                        text(item)
                    ])
                )
            ),
        );
    });
}

export function HistoryInputItem (term: Term) {
    const { currentDirName, userName } = term.global;
    return comp(({ props }) => {
        return div(
            '.InputTitle',
            style.marginBottom(3).lineHeight(20),
            text(`webos:${currentDirName.value} ${userName.value}$ ${props.inputValue.value}`),
        );
    });
}

export function ensureInputIsVisible (container: HTMLElement) {
    if (container.tagName === 'BODY') {
        document.documentElement.scrollTop = document.documentElement.offsetHeight;
    } else {
        // @ts-ignore
        container.scrollTop = container.firstElementChild?.offsetHeight;
    }
}