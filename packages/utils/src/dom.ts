
export function selectInput (dom: HTMLElement) {
    // @ts-ignore
    if (document.selection) {
        // @ts-ignore
        const range = document.body.createTextRange();
        range.moveToElementText(dom);
        range.select();
    } else if (window.getSelection) {
        const range = document.createRange();
        range.selectNodeContents(dom);
        // @ts-ignore
        window.getSelection().removeAllRanges();
        // @ts-ignore
        window.getSelection().addRange(range);
    }
}