<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { IWindowStatus } from '@/core/os/window/window';
import WindowHeader from './window-header.vue';
import { useStore } from '@/ui/store';
const props = defineProps<{
  status: IWindowStatus,
}>();

const store = useStore();

function clickWindow () {
    // eslint-disable-next-line vue/no-mutating-props
    props.status.zIndex = ++store.windowMaxZIndex;
}
</script>

<template>
  <div
    v-show="status.visible"
    class="os-window window-blur"
    :style="{
      'visibility': status.inited ? 'visible': 'hidden',
      'z-index': status.zIndex,
      width: status.width + 'px',
      height: status.height + 'px',
      transform: status.transform(),
      left: status.inited ? 0: '50%',
      top: status.inited ? 0: '50%',
      transition: status.animation ? 'all .3s ease': 'none',
    }"
    @mousedown="clickWindow"
  >
    <WindowHeader :status="status" />
    <div
      :id="'WINDOW_DOM_'+status.id"
      class="window-body"
      :style="{
        'margin-top': status.header.enable ? status.header.height + 'px': '0',
        'height': status.header.enable ? `calc(100% - ${status.header.height}px)`: '100%',
      }"
    >
      <component :is="status.component" :status="status" />
    </div>
  </div>
</template>

<style scoped lang="less">
  .os-window {
    position: fixed;
    // min-width: 500px;
    // min-height: 300px;
    // max-width: 1000px;
    // max-height: 600px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--box-shadow);
    border: 1px solid #5b5b5b
  }
  .window-body{
    overflow: auto;
    position: relative;
  }
</style>