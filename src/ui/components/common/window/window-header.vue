<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { ref } from 'vue';
import type { WindowHeader } from '@/core/os/window';
import { initWindow } from '../drag';
const props = defineProps<{
  header: WindowHeader
}>();

const { closeWindow, minimize, maximize } = props.header.events;

const headerDom = ref();
initWindow(headerDom);

</script>
<template>
  <div
    ref="headerDom"
    class="os-window-header"
    :style="{
      'background-color': header.background
    }"
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
    <div class="os-win-h-title no-select">{{ header.title }}</div>
  </div>
</template>

<style scoped lang="less">
  .os-window-header {
    position: absolute;
    min-height: 28px;
    width: 100%;
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

