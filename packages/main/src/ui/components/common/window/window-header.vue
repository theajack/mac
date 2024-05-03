<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { ref } from 'vue';
import type { IWindowStatus } from '@/core/os/window/window';
import { initWindow } from '../drag';
import { createDoubleClick } from '@/lib/utils';
import { matchStopEvent, StopEvents } from '@/core/utils/dom-event';
import { MenuHeight, WindowWidth, WindowHeight, DockTop } from '@/ui/style/common';
const props = defineProps<{
  status: IWindowStatus
}>();
// @ts-ignore
const { closeWindow, minimize, maximize } = props.status.events || {};

const headerDom = ref();
initWindow(headerDom, props.status);

const isDoubleClick = createDoubleClick();

let prevSize: any = null;

// 充满出状态栏和docker的部分
function toggleFullWindow () {
    const status = props.status;
    if (!status.enableResize) return;
    if (status.isMax) {
        const [ x, y, width, height ] = prevSize;
        status.$animate(() => {
            status.isMax = false;
            status.x = x;
            status.y = y;
            status.width = width;
            status.height = height;
        });
        prevSize = null;
    } else {
        if (typeof status.height === 'string') { status.height = headerDom.value.parentElement.offsetHeight;}
        if (typeof status.width === 'string') { status.width = headerDom.value.parentElement.offsetWidth;}
        prevSize = [ status.x, status.y, status.width, status.height ];
        status.$animate(() => {
            status.isMax = true;
            status.x = 0;
            status.y = MenuHeight;
            status.width = WindowWidth;
            status.height = WindowHeight - MenuHeight - DockTop;
        });
    }
}

async function onClick (e: PointerEvent) {
    if (!isDoubleClick()) return;
    if (matchStopEvent(e, StopEvents.WindowResize)) {
        return;
    }
    toggleFullWindow();
    console.warn('toggleFullWindow');
}


</script>
<template>
  <div
    v-if="status.header"
    ref="headerDom"
    class="os-window-header"
    :style="{
      'background-color': status.header.enable ? status.header.bgColor: 'transparent',
      'height': status.header.height + 'px',
    }"
    @click="onClick"
  >
    <div class="os-win-h-btn no-select" @mousedown.stop>
      <div class="os-win-hb hb-close" @click="closeWindow">
        <span class="hb-inner">×</span>
      </div>
      <div class="os-win-hb hb-min" @click="minimize">
        <span class="hb-inner">-</span>
      </div>
      <!-- todo 暂时先用 toggleFullWindow 代替-->
      <!-- <div class="os-win-hb hb-full" @click="maximize"> -->
      <div class="os-win-hb hb-full" @click="toggleFullWindow">
        <span v-show="status.enableResize" class="hb-inner">+</span>
      </div>
    </div>
    <div v-show="status.header.enable" class="w-full h-full">
      <div v-if="status.header.component" class="w-full h-full">
        <component :is="status.header.component" :id="status.id" :status="status" />
      </div>
      <div v-else class="os-win-h-tittle no-select flex-center h-full">{{ status.header.title }}</div>
    </div>
  </div>
</template>

<style scoped lang="less">
  .os-window-header {
    position: absolute;
    width: 100%;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    .os-win-h-title{
        text-align: center;
        font-weight: bold;
        color: #ccc;
    }
  }

  .os-win-h-btn{
    position: fixed;
    left: 13px;
    z-index: 10000;
    display: flex;
    gap: 7px;
    .os-win-hb{
        height: 12px;
        width: 12px;
        display: inline-block;
        border-radius: 50%;
        color: #434343;
        text-align: center;
        line-height: 9px;
        &.hb-close{
            background-color: #ec6a5d;
        }
        &.hb-min{
            background-color: #f5bd4f
        }
        &.hb-full{
            background-color: #62c454;
        }
        .hb-inner{
            font-size: 12px;
            font-weight: bold;
            visibility: hidden;
            cursor: default;
        }
        &.disabled {
            background-color: #4e4e4e;
            .hb-inner{
                display: none;
            }
        }
        &.hidden {
            display: none;
        }
    }
    &:hover{
        .os-win-hb .hb-inner{
            visibility: visible;
        }
    }
  }
</style>