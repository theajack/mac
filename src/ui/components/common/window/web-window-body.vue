<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">

import type { IWindowStatus } from '@/core/os/window/window';
import { ref } from 'vue';
defineProps<{
    status: IWindowStatus
}>();
const loaded = ref(false);
</script>

<template>
  <div class="h-full w-full relative bg-gray">
    <span v-show="!loaded" class="absolute-center flex-center">
      <i class="text-2xl mr-2 ei-spinner-snake ei-spin" />
      <!-- <span class="text-xl">Loading...</span> -->
    </span>
    <iframe :src="status.url" class="window-iframe" @loadeddata="loaded = true" />
  </div>
</template>

<style scoped lang="less">
.window-iframe{
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>