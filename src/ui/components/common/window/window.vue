<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { IWindowStatus } from '@/core/os/window';
import { WindowHeight, WindowWidth } from '@/ui/style/common';
import WindowHeader from './window-header.vue';
defineProps<{
  status: IWindowStatus,
}>();

const height = `${WindowHeight * 0.8}px`;
const width = `${WindowWidth * 0.8}px`;

</script>

<template>
  <div v-show="status.visible" class="os-window">
    <WindowHeader :header="status.header" />
    <div :id="'WINDOW_DOM_'+status.id" />
  </div>
</template>

<style scoped lang="less">
  .os-window {
    position: fixed;
    width: v-bind(width);
    height: v-bind(height);
    min-width: 500px;
    min-height: 300px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--box-shadow);
  }
</style>

