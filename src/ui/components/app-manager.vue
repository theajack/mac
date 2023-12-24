<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:14:50
 * @Description: Coding something
-->

<script setup lang="ts">
import type { OS } from '@/core/os/os';
import type { IWindowStatus } from '@/core/os/window';
import { ref } from 'vue';
import Window from './common/window/window.vue';
import { MacEvent } from '@/core/os/event-bus';

const windowStatus = ref<IWindowStatus[]>([]);

MacEvent.on('os-inited', (os: OS) => {
    // console.log(os.appManager.windowStatus);
    windowStatus.value = os.appManager.windowStatus;
});
</script>

<template>
  <div>
    <Window v-for="status in windowStatus" :key="status.id" :status="status" />
  </div>
</template>

<style scoped lang="less">
  .os-windows-container{
    position: fixed;
    width: 0;
    height: 0;
    top: 0;
  }
</style>@/core/os/window/window