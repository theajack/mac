<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { IWindowStatus } from '@/core/os/window';
import WindowHeader from './window-header.vue';
defineProps<{
  status: IWindowStatus,
}>();

</script>

<template>
  <div
    v-show="status.visible" class="os-window"
    :style="{
      'z-index': status.zIndex,
      width: status.width + 'px',
      height: status.height + 'px'
    }"
  >
    <WindowHeader :header="status.header" />
    <div :id="'WINDOW_DOM_'+status.id" class="window-body" />
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
    padding-top: 28px;
  }
</style>

