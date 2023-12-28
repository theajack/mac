<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { useGlobalStore } from '@/ui/store';
import { ref } from 'vue';

// defineEmits([ 'loaded' ]);
defineProps<{
    url?: string,
}>();
const loaded = ref(false);
</script>

<template>
  <div class="w-full h-full flex-center bg-gray" :class="{dragging: useGlobalStore().inDragging}">
    <i v-show="!loaded" class="absolute-center text-2xl mr-2 ei-spinner-snake ei-spin" />
    <iframe
      class="w-full h-full relative"
      :src="url"
      frameborder="0"
      @load="loaded = false"
    />
  </div>
</template>

<style lang="less">
.dragging::before{
    content: ' ';
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
}
</style>
