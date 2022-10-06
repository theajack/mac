<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:14:50
 * @Description: Coding something
-->

<script setup lang="ts">
import Menu from './menu.vue';
import Center from './center.vue';
</script>

<template>
  <div class="status-bar bg-blur-nb">
    <Menu />
    <Center />
  </div>
</template>

<style scoped lang="less">
  .status-bar{
    width: 100%;
    height: 40px;
    display: flex;
  }
  // background-color: #2224;
</style>