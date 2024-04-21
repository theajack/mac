/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-20 13:25:14
 * @Description: Coding something
 */
import type { IPos } from '@/core/type';
import { isClick, isTwoRectIntersect } from '@/lib/utils';
import { getFileContent, useFinderStore } from './finder-store';
import { MacEvent } from '@/core/os/event-bus';
import { AppNames } from '@/core/apps/app-config';
import { getLatestWindow } from '@/core/os/os';
import { createUseInstance } from '@/lib/use-instance';

export const FileLength = 70;

class FinderLayoutManager {

    mouseDownPos: IPos = { x: 0, y: 0 };
    mouseDownClient: IPos;

    fileLen = FileLength; // 固定宽高70

    // 文件起始位置
    filesLayouts: (IPos & {id: string})[] = [];

    container: HTMLElement;
    selectArea: HTMLElement;
    scrollContainer: HTMLElement;

    private _isSelectAreaActive = false;

    doubleClickFileCheck = (() => {
        let lastFileId = '';
        const gap = 300;
        let timer: any;

        return (id: string) => {
            clearTimeout(timer);
            if (id === lastFileId) {
                lastFileId = '';
                return true;
            }
            lastFileId = id;
            timer = setTimeout(() => {lastFileId = '';}, gap);
            return false;
        };
    })();

    private _finderId: number;
    private _areaOffset: IPos;
    initContainer (el: HTMLElement, finderId: number) {
        this.container = el.children[0] as HTMLElement;
        this.scrollContainer = el.parentElement!;
        this.selectArea = el.children[1] as HTMLElement;
        this._finderId = finderId;

        // 等待dom初始化完成
        setTimeout(() => {
            const rect = this.container.getBoundingClientRect();
            const status = getLatestWindow()!.status;
            console.log(rect.x, rect.y, status.x, status.y);
            this._areaOffset = {
                x: rect.x - status.x,
                y: rect.y - status.y,
            };
        }, 100);


        const moveHandler = (e: MouseEvent) => { this.onMouseMove(e); };
        const upHandler = (e: MouseEvent) => { this.onMouseUp(e); };
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', upHandler);
        this._releaseHandler = () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
    }

    private _releaseHandler: any = null;
    releaseEvent () {
        this._releaseHandler?.();
    }

    private parsePos (e: MouseEvent) {
        return {
            x: e.offsetX,
            y: e.offsetY,
        };
    }

    private parseClientPos (e: MouseEvent) {
        return {
            x: e.clientX,
            y: e.clientY,
        };
    }

    private parseTargetType (e: MouseEvent): string {
        const el = e.target as HTMLElement;
        return el.dataset.type || '';
    }

    private getScrollPos () {
        return {
            x: this.scrollContainer.scrollLeft,
            y: this.scrollContainer.scrollTop
        };
    }

    onMouseDown (e: MouseEvent) {
        this.mouseDownPos = this.parsePos(e);
        this.mouseDownClient = this.parseClientPos(e);
        if (this.parseTargetType(e) === 'finder') {
            this._isSelectAreaActive = true;
            // ! 每次可能选择之前都更新layout
            this.initFilesLayout();
        }
    }

    private countOffsetPos (e: MouseEvent) {
        const client = this.parseClientPos(e);
        const c1 = this.mouseDownClient;
        const p = this.mouseDownPos;

        return {
            x: p.x - (c1.x - client.x),
            y: p.y - (c1.y - client.y)
        };
    }

    onMouseMove (e: MouseEvent) {
        if (!this._isSelectAreaActive) return;

        const pos = this.countOffsetPos(e);

        const x = Math.min(pos.x, this.mouseDownPos.x);
        const y = Math.min(pos.y, this.mouseDownPos.y);

        const width = Math.abs(pos.x - this.mouseDownPos.x);
        const height = Math.abs(pos.y - this.mouseDownPos.y);
        const style = this.selectArea.style;

        style.display = 'block';
        style.left = `${x + this._areaOffset.x}px`;
        style.top = `${y + this._areaOffset.y}px`;
        style.width = `${width}px`;
        style.height = `${height}px`;

        console.log('offset', x, y);

        const selectO = { x: x + width / 2, y: y + height / 2 };
        this.checkFilesIsSelected(selectO, width / 2, height / 2);
    }

    async onMouseUp (e: MouseEvent) {
        const type = this.parseTargetType(e);

        if (type !== 'file' && type !== 'finder') return;

        const pos2 = this.countOffsetPos(e);
        const clicked = isClick(this.mouseDownPos, pos2);
        console.log(pos2, clicked);

        if (clicked) {
            const store = useFinderStore(this._finderId);
            if (type === 'file') {
                console.log('clicked isOnFile!');
                const el = e.target as HTMLElement;
                const id = el.dataset.id || '';
                // console.log(type, id, store.activeIds);

                if (e.metaKey || e.ctrlKey) {
                    if (store.activeIds.has(id)) {
                        store.activeIds.delete(id);
                    } else {
                        store.activeIds.add(id);
                    }
                } else {
                    store.chooseSingleFile(id);
                }

                if (this.doubleClickFileCheck(id)) {
                    const { dir, path } = el.dataset as Record<string, string>;
                    if (dir === 'true') {
                        store.entryDir(path);
                    } else {
                        console.log('click file');
                        const content = await getFileContent(path);
                        MacEvent.emit('new-window', { name: AppNames.textEdit, data: { content } });
                    }
                }
            } else if (type === 'finder') {
                store.activeIds.clear();
                this._isSelectAreaActive = false;
            }
        } else {
            if (this._isSelectAreaActive) {
                this._isSelectAreaActive = false;
                this.selectArea.style.display = 'none';
            }
        }
    }

    private checkFilesIsSelected (areaPos: IPos, halfWidth: number, halfHeight: number) {
        const store = useFinderStore(this._finderId);
        const halfLen = this.fileLen / 2;

        const scrollPos = this.getScrollPos();

        areaPos.x += scrollPos.x;
        areaPos.y += scrollPos.y;

        this.filesLayouts.forEach(pos => {
            if (isTwoRectIntersect(pos, halfLen, halfLen, areaPos, halfWidth, halfHeight)) {
                store.activeIds.add(pos.id);
            } else {
                store.activeIds.delete(pos.id);
            }
        });
    }

    initFilesLayout () {
        const half = this.fileLen / 2;
        this.filesLayouts = Array.from(this.container.children).map((el: HTMLElement) => {
            return {
                x: el.offsetLeft + half,
                y: el.offsetTop + half,
                id: el.dataset.id || '',
            };
        });
    }

}

export const useFinderLayoutManager = createUseInstance(FinderLayoutManager);