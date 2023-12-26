/*
 * @Author: theajack
 * @Date: 2023-04-05 20:10:30
 * @Description: Coding something
 */
import { MacEvent } from '@/core/os/event-bus';
import { isUrl } from '@/lib/utils';
import { defineStore } from 'pinia';
import { AppNames } from '../../app-config';
import { underDevelopment } from '@/ui/components/common/toast/toast';

export interface ITabItem {
    url: string,
    title: string,
    icon: string,
    id: number,
    isStart?: boolean,
}

export const DefaultPH = '搜索或输入网站名称';

function createSingleStore (id: number) {
    let pageId = 0;
    return defineStore(`safari-store-${id}`, {
        state: () => ({
            query: '',
            isFocus: false,
            tabs: [ ] as ITabItem[],
            activeId: -1,
            activeItem: {} as ITabItem,
            inputWidth: 0,
            isUrlAsQuery: false,
        }),

        actions: {
            initInputWidth (dom: any) {
                this.inputWidth = (this.isFocus || this.query !== '') ? 360 : dom.offsetWidth;
            },
            startQuery () {
                let query = this.query;
                const curItem = this.activeItem;
                if (!curItem) throw new Error('current tab not found');
                if (!isUrl(query)) {
                    query = `https://cn.bing.com/search?q=${query}`;
                } else {
                    if (!query.startsWith('http')) {
                        query = `https://${query}`;
                    }
                }
                const url = new URL(query);
                Object.assign(curItem, {
                    url: query,
                    title: url.host,
                    icon: 'ei-safari', // todo
                    isStart: false,
                });
                this.query = '';
            },
            setActiveId (id: number) {
                this.activeId = id;
                this.activeItem = this._findItem(id);
                this.query = '';
            },
            _findItem (id: number) {
                return this.tabs.find(item => item.id === id)!;
            },
            _findItemIndex (id: number) {
                return this.tabs.findIndex(item => item.id === id);
            },
            newTab () {
                const id = pageId++;
                this.tabs.push({
                    id: id,
                    url: '',
                    title: 'Start Page',
                    icon: 'el-star-off',
                    isStart: true,
                });
                this.setActiveId(id);
                return id;
            },
            back () {
                underDevelopment();
                // @ts-ignore
                const iframe: HTMLIFrameElement = document.getElementById(this.iframeId(this.activeId))!;
                iframe.contentWindow?.history.back();
            },
            forward () {
                underDevelopment();
                // @ts-ignore
                const iframe: HTMLIFrameElement = document.getElementById(this.iframeId(this.activeId))!;
                iframe.contentWindow?.history.forward();
            },
            iframeId (id: string|number) {
                return `SAFARI_IFRAME_${id}`;
            },
            close (id: number) {
                const index = this.tabs.findIndex(item => item.id === id);
                const isOnlyOne = this.tabs.length === 1;

                this.tabs.splice(index, 1);
                if (id === this.activeId) {
                    if (isOnlyOne) {
                        const id = this.newTab();
                        this.setActiveId(id);
                    } else {
                        const newIndex = index - 1 < 0 ? index : index - 1;
                        this.setActiveId(this.tabs[newIndex].id);
                    }
                }
            },
            // _removeItem(index: number){
            //     if(!this.tabs[index]) return;
            //     const item = this.tabs.splice(index, 1)[0];

            //     if(item.id === this.activeId){

            //     }
            // }
            focusInput () {
                this.isFocus = true;
                const item = this.activeItem;
                if (!item.isStart && !this.query) {
                    this.query = item.url;
                    this.isUrlAsQuery = true;
                }
            },
            dragTabIndex (src: number, target: number|'self') {
                if (target === 'self') return;

                if (target === -1) {
                    // 新窗口
                    const item = this._findItem(src);
                    this.close(item.id);
                    MacEvent.emit('new-window', { name: AppNames.safari, data: item });
                    return;
                }
                const targetIndex = this._findItemIndex(target);
                const item = this.removeTab(src);
                this.tabs.splice(targetIndex, 0, item[0]);
            },
            removeTab (id: number) {
                return this.tabs.splice(this._findItemIndex(id), 1);
            },
            initNewWindow (data: ITabItem) {
                this.tabs = [ data ];
                this.setActiveId(data.id);
            }
        },
        getters: {
            isEmptyQuery (state) {
                if (state.isUrlAsQuery) return true;
                return state.activeItem.isStart || !state.query;
            },
            showTab (state) {
                return state.tabs.length > 1;
            },
            isStartPage (state) {
                return state.activeItem.isStart;
            },
            placeholder (state) {
                return state.activeItem.isStart ? DefaultPH : state.activeItem.title;
            },
        }
    });
}

const storeMap: Record<number, ReturnType<typeof createSingleStore>> = {};

export function createSafariStore (id: number) {

    if (storeMap[id]) return storeMap[id]();

    const useStore = createSingleStore(id);

    storeMap[id] = useStore;

    return useStore();
}
