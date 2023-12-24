<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:09:24
 * @Description: 程序坞
-->

<script setup lang="ts">
import { getDockApps, getTempDockApps, getTrash } from '@/core/context';
import { WindowCapture } from '@/core/os/window/window-capture';
import { ref } from 'vue';
import DockItem from './dock-item.vue';
import DockCapture from './dock-capture.vue';
import { App } from '@/core/apps/app';
import { Window } from '@/core/os/window/window';

const apps = ref(getDockApps());

const tempApps = ref(getTempDockApps());

const captures = ref(WindowCapture.List);

const trash = getTrash();

(window as any).apps = apps;

</script>

<template>
  <div class="dock-bar no-select">
    <DockItem
      v-for="item in apps"
      :key="item.name"
      :app="(item as App)"
    />
    <span v-show="tempApps.length > 0" class="dock-split" />
    <DockItem
      v-for="item in tempApps"
      :key="item.name"
      :app="(item as App)"
    />
    <span class="dock-split" />
    <div id="windowCaptureContainer">
      <DockCapture
        v-for="item in captures"
        :key="item.id"
        :window="(item.window as Window)"
      />
      <div id="CapturePlaceHolder" class="dock-item" />
    </div>
    <DockItem :app="trash" />
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
  width: max-content;

  .dock-split{
    display: inline-block;
    width: 1px;
    height: 46px;
    background-color: #eee8;
    margin-right: 12px;
  }
}
#windowCaptureContainer{
  display: flex;
}
#CapturePlaceHolder{
  height: 48px;
  // width: 5px;
  // background-color: #000;
}
</style>
@/core/os/window/window-capture