<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { IWindowStatus } from '@/core/os/window/window';
import WindowHeader from './window-header.vue';
defineProps<{
  status: IWindowStatus,
}>();
</script>

<template>
  <div
    v-show="status.visible"
    class="os-window window-blur"
    :style="{
      'visibility': (status.inited && status.visible) ? 'visible': 'hidden',
      'z-index': status.zIndex,
      width: status.width + 'px',
      height: status.height + 'px',
      transform: status.transform(),
      left: status.inited ? 0: '50%',
      top: status.inited ? 0: '50%',
      transition: status.animation ? 'all .3s ease': 'none',
    }"
    @mousedown="() => status.$bringToTop(true)"
  >
    <WindowHeader :status="status" />
    <div
      :id="'WINDOW_DOM_'+status.id"
      class="window-body"
      :style="{
        'margin-top': status.header.enable ? status.header.height + 'px': '0',
        'height': status.header.enable ? `calc(100% - ${status.header.height}px)`: '100%',
        backgroundColor: status.background ? status.background: 'var(--bg-gray)',
      }"
    >
      <component :is="status.component" :id="status.id" :status="status" />
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