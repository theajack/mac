<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { createFinderStore } from './finder-store';

const props = defineProps<{
    id: number
}>();
const store = createFinderStore(props.id);
</script>

<template>
  <div
    class="flex items-center justify-between w-full h-full"
  >
    <div class="left-block  h-full" :style="{width: `${store.leftPanelWidth}px`}" />
    <div class="flex-1 px-2 h-full flex items-center bg-header">
      underDevelopment
    </div>
  </div>
</template>

<style scoped lang="less">
@import url(./finder.less);
</style>

