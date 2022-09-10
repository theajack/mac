<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:09:24
 * @Description: 程序坞
-->

<script setup lang="ts">
import { desktop } from '@/ui/desktop/desktop';
import { Dock } from '@/ui/desktop/dock';
import DockItem from './dock-item.vue';

new Dock();

console.warn(DockItem, desktop.dock);
</script>

<template>
  <div class="dock-bar">
    <DockItem
      name=""
      icon=""
    />
    <DockItem
      name=""
      icon=""
    />
    <DockItem
      name=""
      icon=""
    />
  </div>
</template>

<style scoped lang="less">
.dock-bar {
  color: #42b983;
  display: flex;
  position: fixed;
  left: 50%;
  transform: translate(-50%, -5px);
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 10px 10px 12px 10px;
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-white-200);
  border-radius: 14px;
  box-shadow: 0 0 30px rgb(0 0 0 / 56%);
  z-index: 10;
}
</style>
