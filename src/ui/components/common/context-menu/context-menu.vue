<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { createContextMenuRef } from './context-menu';
import Select from '../select/index.vue';

const {
    position,
    visible,
    list
} = createContextMenuRef();
// todo

</script>

<template>
  <div
    :style="{
      left: `${position.left}px`,
      top: `${position.top}px`
    }" class="context-menu"
  >
    <Select v-show="visible" :list="list" />
  </div>
</template>

<style scoped lang="less">
.context-menu{
    position: fixed;
    z-index: 1000;
}
</style>

