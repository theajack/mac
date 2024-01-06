export default function keyDown (this: HTMLTextAreaElement, e: KeyboardEvent, tab = '\t') {
    const a = tab;
    const b = a.length;
    if (e.keyCode === 9) {
        e.preventDefault();
        const c = this.selectionStart,
            currentEnd = this.selectionEnd;
        if (e.shiftKey === false) {
            if (!_isMultiLine(this)) {
                this.value = this.value.slice(0, c) + a + this.value.slice(c);
                this.selectionStart = c + b;
                this.selectionEnd = currentEnd + b;
            } else {
                const d = _findStartIndices(this);
                let l = d.length,
                    newStart = undefined,
                    newEnd = undefined,
                    affectedRows = 0;
                while (l--) {
                    let f = d[l];
                    if (d[l + 1] && c != d[l + 1]) f = d[l + 1];
                    if (f >= c && d[l] < currentEnd) {
                        this.value = this.value.slice(0, d[l]) + a + this.value.slice(d[l]);
                        newStart = d[l];
                        if (!newEnd) newEnd = (d[l + 1] ? d[l + 1] - 1 : 'end');
                        affectedRows++;
                    }
                }
                // @ts-ignore
                this.selectionStart = newStart;
                // @ts-ignore
                this.selectionEnd = (newEnd !== 'end' ? newEnd + (b * affectedRows) : this.value.length);
            }
        } else {
            if (!_isMultiLine(this)) {
                if (this.value.substr(c - b, b) == a) {
                    this.value = this.value.substr(0, c - b) + this.value.substr(c);
                    this.selectionStart = c - b;
                    this.selectionEnd = currentEnd - b;
                } else if (this.value.substr(c - 1, 1) == '\n' && this.value.substr(c, b) == a) {
                    this.value = this.value.substring(0, c) + this.value.substr(c + b);
                    this.selectionStart = c;
                    this.selectionEnd = currentEnd - b;
                }
            } else {
                const d = _findStartIndices(this);
                let l = d.length,
                    newStart = undefined,
                    newEnd = undefined,
                    affectedRows = 0;
                while (l--) {
                    let f = d[l];
                    if (d[l + 1] && c != d[l + 1]) f = d[l + 1];
                    if (f >= c && d[l] < currentEnd) {
                        if (this.value.substr(d[l], b) == a) {
                            this.value = this.value.slice(0, d[l]) + this.value.slice(d[l] + b);
                            affectedRows++;
                        } else { }
                        newStart = d[l];
                        if (!newEnd) newEnd = (d[l + 1] ? d[l + 1] - 1 : 'end');
                    }
                }
                // @ts-ignore
                this.selectionStart = newStart;
                // @ts-ignore
                this.selectionEnd = (newEnd !== 'end' ? newEnd - (affectedRows * b) : this.value.length);
            }
        }
    } else if (e.keyCode === 13 && e.shiftKey === false && e.ctrlKey === false) {
        const cursorPos = this.selectionStart;
        const d = _findStartIndices(this);
        const numStartIndices = d.length;
        const tabMatch = new RegExp('^' + a.replace('\t', '\\t').replace(/ /g, '\\s') + '+', 'g');
        let lineText = '';
        let tabs = null;
        let startIndex = 0;
        let endIndex = 0;
        for (let x = 0; x < numStartIndices; x++) {
            if (d[x + 1] && (cursorPos >= d[x]) && (cursorPos < d[x + 1])) {
                startIndex = d[x];
                endIndex = d[x + 1] - 1;
                break;
            } else {
                startIndex = d[numStartIndices - 1];
                endIndex = this.value.length;
            }
        }
        lineText = this.value.slice(startIndex, endIndex);
        tabs = lineText.match(tabMatch);
        if (tabs !== null) {
            e.preventDefault();
            let h = tabs[0];
            let i = h.length;
            const j = cursorPos - startIndex;
            if (i > j) {
                i = j;
                h = h.slice(0, j);
            }
            this.value = this.value.slice(0, cursorPos) + '\n' + h + this.value.slice(cursorPos);
            this.selectionStart = cursorPos + i + 1;
            this.selectionEnd = this.selectionStart;
        }
    }
}
function _isMultiLine (a: HTMLTextAreaElement) {
    const b = a.value.slice(a.selectionStart, a.selectionEnd),
        nlRegex = new RegExp(/\n/);
    if (nlRegex.test(b)) return true;
    else return false;
}
function _findStartIndices (a: HTMLTextAreaElement) {
    let b = a.value,
        offset = 0;
    const startIndices = [];
    while (b.match(/\n/) && b.match(/\n/)!.length > 0) {
        offset = (startIndices.length > 0 ? startIndices[startIndices.length - 1] : 0);
        const c = b.search('\n');
        startIndices.push(c + offset + 1);
        b = b.substring(c + 1);
    }
    startIndices.unshift(0);
    return startIndices;
}