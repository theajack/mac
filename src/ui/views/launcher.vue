<!--
 * @Author: chenzhongsheng
 * @Date: 2023-12-30 21:53:48
 * @Description: Coding something
-->
<!--
 * @Author: chenzhongsheng
 * @Date: 2023-12-22 23:06:54
 * @Description: Coding something
-->
<script lang='ts' setup>
import { resource } from '@/lib/utils';
import { useGlobalStore } from '../store';
import { getApps } from '@/core/context';
import { computed, ref } from 'vue';
import type { App } from '@/core/apps/app';
import AppBlock from '@/ui/components/app-block.vue';
import SearchInput from '@/ui/components/common/search-input.vue';
import { DockTop, WindowWidth } from '../style/common';

const store = useGlobalStore();
const url = resource('desktop-bg.jpg');

const allApps = getApps();
const PageSize = 9;
const pages = computed(() => {
    const arr: App[][] = [];
    for (let i = 0; i < allApps.length; i += PageSize) {
        arr.push(allApps.slice(i, i + PageSize));
    }
    return arr;
});

const singleLineCount = 7;
const searchHeight = 50;
const pageDotHeight = 50;
const launcherLines = 5;
const launcherPadding = 30;

const lineHeight = computed(() => {
    return `${(store.windowHeight - DockTop - searchHeight - pageDotHeight - launcherPadding * 2) / launcherLines}px`;
});

function clickLauncherApp (app: App) {
    closeLauncher();
    app.onOpen();
}

let isSwitchPage = false;

function closeLauncher () {
    if (isSwitchPage) return;
    store.showLauncher = false;
}

const launcherSearch = ref('');
const activeIndex = ref(0);
const launcherLeft = ref(0);
const showLauncherAnimation = ref(false);

const switchPageIndex = (i: number) => {
    showLauncherAnimation.value = true;
    activeIndex.value = i;
    launcherLeft.value = i * WindowWidth;
};

let lastX = 0;
let isMouseDown = false;
const mouseDown = (e: MouseEvent) => {
    isMouseDown = true;
    showLauncherAnimation.value = false;
    isSwitchPage = false;
    lastX = e.clientX;
};
const mouseMove = (e: MouseEvent) => {
    if (!isMouseDown) return;
    const offset = (e.clientX - lastX) / 20;
    const nv = launcherLeft.value - offset;
    const maxBoundary = 60;
    if (nv < -maxBoundary || nv > (pages.value.length - 1) * WindowWidth + maxBoundary) {
        return;
    }
    launcherLeft.value = nv;
};
const mouseUp = (e: MouseEvent) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    const dis = e.clientX - lastX;
    if (Math.abs(dis) > 5) {
        isSwitchPage = true;
        const nv = activeIndex.value + (dis > 0 ? -1 : 1);
        if (nv >= 0 && nv < pages.value.length) {
            switchPageIndex(nv);
            return;
        }
    }
    showLauncherAnimation.value = true;
    launcherLeft.value = activeIndex.value * WindowWidth;
};

</script>
<template>
  <transition name="fade">
    <div
      v-show="store.showLauncher"
      :style="{
        backgroundImage: `url(${url})`,
        paddingBottom: `${DockTop}px`
      }"
      class="launcher-mask flex flex-col bg-cover bg-blur"
      @mousedown="mouseDown"
      @mouseup="mouseUp"
      @mousemove="mouseMove"
      @click="closeLauncher"
    >
      <div
        class="launcher-search flex-center"
        :style="{height: `${searchHeight}px`}"
      >
        <SearchInput v-model="launcherSearch" />
      </div>
      <div
        class="launcher-container flex-1 flex w-fit"
        :class="{animation: showLauncherAnimation}"
        :style="{
          transform: `translateX(${-launcherLeft}px)`,
        }"
      >
        <div
          v-for="(page, pageIndex) in pages"
          :key="pageIndex"
          class="launcher-page flex items-center"
          :style="{
            padding: `${launcherPadding}px 110px`,
          }"
          @mouseup.stop
        >
          <div
            v-for="app in page" :key="app.name"
            :style="{width: `${100/singleLineCount}%`}"
            class="launcher-app flex-center"
          >
            <AppBlock :height="70" :app="app" @click="clickLauncherApp(app)" />
            <div class="launcher-title">{{ app.title }}</div>
          </div>
        </div>
      </div>
      <div class="launcher-page-dot flex-center" :style="{height: `${pageDotHeight}px`}" @mousedown.stop>
        <span
          v-for="(i, index) in pages"
          :key="index"
          :class="{active: index === activeIndex}"
          @click.stop="switchPageIndex(index)"
        />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="less">
.launcher-mask {
    user-select: none;
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: 9;
    .launcher-search{
      flex-shrink: 0;
    }
    .launcher-page-dot{
      flex-shrink: 0;
    }
    .launcher-container {
        &.animation{
          transition: transform .3s ease;
        }
        .launcher-page {
          width: 100vw;
          display: flex;
          flex-wrap: wrap;
          height: fit-content;
          max-height: calc(100vw-100);
          .launcher-app{
            height: v-bind(lineHeight);
            flex-grow: 0;
            position: relative;
            overflow: hidden;
            flex-direction: column;
            gap: 5px;
            .launcher-title{
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              width: 100%;
              text-align: center;
            }
          }
        }
    }
    .launcher-page-dot{
      display: flex;
      gap: 10px;
      align-items: start;
      span{
        background-color: #fefefe;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        opacity: .3;
        transition: opacity .3s ease;
        &.active{
          opacity: 1;
        }
      }
    }
}

.fade-enter-active,
.fade-leave-active {
  transition: all .3s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(1.4);
}
</style>
