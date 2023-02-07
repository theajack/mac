<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { IWindowStatus } from '@/core/os/window';
defineProps<{
  status: IWindowStatus
}>();
</script>

<template>
  <div :id="'WINDOW_DOM_'+status.id" class="os-window" />
</template>

<style scoped lang="less">
  .os-window {
    position: fixed;
    width: 80%;
    height: 80%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>

