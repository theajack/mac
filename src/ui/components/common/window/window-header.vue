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
import { MenuHeight, WindowWidth, WindowHeight, DockTop } from '@/ui/style/common';
const props = defineProps<{
  status: IWindowStatus
}>();

const { closeWindow, minimize, maximize } = props.status.header.events;

const headerDom = ref();
initWindow(headerDom, props.status);

const isDoubleClick = createDoubleClick();

let prevSize: any = null;

async function onClick () {
    const status = props.status;
    if (!isDoubleClick() || !status.enableResize) return;


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


</script>
<template>
  <div
    ref="headerDom"
    class="os-window-header"
    :style="{
      'background-color': status.header.headerBgColor
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
      <div class="os-win-hb hb-full" @click="maximize">
        <span class="hb-inner">+</span>
      </div>
    </div>
    <div class="os-win-h-title no-select">{{ status.header.title }}</div>
  </div>
</template>

<style scoped lang="less">
  .os-window-header {
    position: absolute;
    min-height: 28px;
    width: 100%;
    z-index: 10;
    .os-win-h-btn{
        position: fixed;
        top: 4px;
        left: 13px;
        .os-win-hb{
            height: 12px;
            width: 12px;
            display: inline-block;
            border-radius: 50%;
            color: #434343;
            margin-right: 7px;
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
    .os-win-h-title{
        line-height: 28px;
        text-align: center;
        font-weight: bold;
        color: #ccc;
    }
  }
</style>