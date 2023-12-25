/*
 * @Author: theajack
 * @Date: 2023-04-05 20:10:30
 * @Description: Coding something
 */
import { isUrl } from '@/lib/utils';
import { defineStore, acceptHMRUpdate } from 'pinia';

export interface ITabItem {
    url: string,
    title: string,
    icon: string,
    id: number,
    isStart?: boolean,
}

let pageId = 0;

export const DefaultPH = '搜索或输入网站名称';

export const useSafariStore = defineStore('safari-store', {
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
            this.activeItem = this.tabs.find(item => item.id === this.activeId)!;
            this.query = '';
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
            // @ts-ignore
            const iframe: HTMLIFrameElement = document.getElementById(this.iframeId(this.activeId))!;
            iframe.contentWindow?.history.back();
        },
        forward () {
            // @ts-ignore
            const iframe: HTMLIFrameElement = document.getElementById(this.iframeId(this.activeId))!;
            iframe.contentWindow?.history.forward();
        },
        iframeId (id: string|number) {
            return `SAFARI_IFRAME_${id}`;
        },
        close () {
            const activeId = this.activeId;
            const index = this.tabs.findIndex(item => item.id === activeId);
            const isOnlyOne = this.tabs.length === 1;
            this.tabs.splice(index, 1);

            if (isOnlyOne) {
                const id = this.newTab();
                this.setActiveId(id);
            } else {
                this.setActiveId(activeId - 1 < 0 ? activeId : activeId - 1);
            }
        },
        focusInput () {
            this.isFocus = true;
            const item = this.activeItem;
            if (!item.isStart && !this.query) {
                this.query = item.url;
                this.isUrlAsQuery = true;
            }
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

// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.accept(acceptHMRUpdate(useSafariStore, import.meta.hot));
}