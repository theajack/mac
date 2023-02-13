<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:14:50
 * @Description: Coding something
-->

<script setup lang="ts">
import { OS } from '@/core/os/os';
import { IWindowStatus } from '@/core/os/window';
import { ref } from 'vue';
import event from 'tc-event';
import Window from './common/window/window.vue';

const windowStatus = ref<IWindowStatus[]>([]);

event.regist('OS_INITED', (os: OS) => {
    // console.log(os.appManager.windowStatus);
    windowStatus.value = os.appManager.windowStatus;
});
</script>

<template>
  <Window v-for="status in windowStatus" :key="status.id" :status="status" />
</template>

<style scoped lang="less">
  .os-windows-container{
    position: fixed;
    width: 0;
    height: 0;
    top: 0;
  }
</style>