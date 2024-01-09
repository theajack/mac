<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import Select from '../select/index.vue';
import { useContextMenuRef, initDom } from './context-menu';
import { onMounted, ref } from 'vue';
import { useGlobalStore } from '@/ui/store';
const menuDom = ref();

const {
    position,
    visible,
} = useContextMenuRef();

onMounted(() => {
    initDom(menuDom.value);
});

</script>

<template>
  <div
    ref="menuDom"
    :style="{
      left: `${position.left}px`,
      top: `${position.top}px`,
      opacity: position.opacity,
    }" class="context-menu"
  >
    <Select v-show="visible" :list="useGlobalStore().globalMenuList" />
  </div>
</template>

<style scoped lang="less">
.context-menu{
    position: fixed;
    z-index: 1000;
}
</style>

