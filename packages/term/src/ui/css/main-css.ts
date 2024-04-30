/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-10 10:44:34
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-06 12:22:57
 */
import { css, style } from 'alins-style';
import { Color, CommonFont } from './styles/atoms';

export const CommonStyle = {
    FontSize: style.fontSize(16),
    SuccessColor: Color.Success,
};

export function initContainerStyle (container: string|HTMLElement) {
    let selector = '';
    if (typeof container !== 'string') {
        const name = 'WEBOS_CONTAINER';
        selector = `.${name}`;
        container.classList.add(name);
    } else {
        selector = container;
    }
    css(selector)(
        style.backgroundColor('#111')
            .color('#fff')
            .join(CommonStyle.FontSize)
            .margin(0).padding(15).overflow('auto'), // .height(300),
        CommonFont,
        [ '*', CommonFont ],
        ...HelpCss(),
        [ '&::-webkit-scrollbar', style({
            width: 5,
            cursor: 'pointer',
            height: 5,
        }) ],
        [ '&::-webkit-scrollbar-button', style({
            display: 'none',
        }) ],
        [ '&::-webkit-scrollbar-track', style({
            display: 'none',
        }) ],
        [ '&::-webkit-scrollbar-thumb', style({
            backgroundColor: 'hsla(0,0%,53.3%,.4)',
            cursor: 'pointer'
        }) ],
        [ '&::-webkit-scrollbar-track-piece', style({
            backgroundColor: 'hsla(0,0%,53.3%,.06666666666666667)'
        }) ]
    ).mount();
}


function HelpCss () {
    const common = (w: number) => style.display('inline-block').width(w);
    return [
        [ '.help-item', style.display('flex').alignItems('center') ],
        [ '.help-name', common(90) ],
        [ '.help-text', common(320) ]
    ];
}

export const EditorStyle = style.padding(10)
    .outline('none')
    .border('1px solid #444')
    .margin('10px 0')

    .join({
        WebkitUserModify: 'read-write-plaintext-only',
        minHeight: '100px'
    });

export const TextBtn = style.textDecoration('underline')
    .color('#5f5fff')
    .cursor('pointer')
    .marginRight(10);