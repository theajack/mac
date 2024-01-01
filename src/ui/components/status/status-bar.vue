<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:14:50
 * @Description: Coding something
-->

<script setup lang="ts">
import Menu from './menu.vue';
import Center from './center.vue';
import { MenuHeightStr } from '@/ui/style/common';

</script>

<template>
  <div class="status-bar no-select bg-blur-nb" @contextmenu.prevent>
    <Menu />
    <Center />
  </div>
</template>

<style scoped lang="less">
  .status-bar{
    width: 100%;
    height: v-bind(MenuHeightStr);
    display: flex;
    z-index: 10,
  }
  // background-color: #2224;
</style>