<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:09:24
 * @Description: 程序坞
-->

<script setup lang="ts">
import { getDockApps } from '@/core/context';
import DockItem from './dock-item.vue';

const apps = getDockApps();

(window as any).apps = apps;

</script>

<template>
  <div class="dock-bar">
    <DockItem
      v-for="item in apps"
      :key="item.name"
      :app="item"
    />
  </div>
</template>

<style scoped lang="less">
.dock-bar {
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
  box-shadow: var(--box-shadow);
  z-index: 10;
}
</style>
