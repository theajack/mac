<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">

import type { IWindowStatus } from '@/core/os/window/window';
defineProps<{
    status: IWindowStatus
}>();
</script>

<template>
  <div class="h-full w-full relative bg-gray">
    <span class="absolute-center flex-center">
      <i class="text-4xl mr-2 ei-spinner-snake ei-spin" />
      <!-- <span class="text-xl">Loading...</span> -->
    </span>
    <iframe :src="status.url" class="window-iframe" />
  </div>
</template>

<style scoped lang="less">
.window-iframe{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>