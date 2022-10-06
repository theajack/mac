<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
// import { ref } from 'vue';
import { ISelectItem } from '@/core/types/component';
import Item from './item.vue';
defineProps<{
    list: ISelectItem[]
}>();
</script>

<template>
  <div class="os-select-list bg-blur">
    <Item
      v-for="item in list"
      :key="item.name"
      :item="item"
      class="os-select-item"
    />
  </div>
</template>

<style lang="less">
  .os-select-list {
    color: #fff;
    min-width: 100px;
    display: inline-block;
    .os-select-item {
      padding: 2px 5px;
      border-radius: 4px;
      white-space: nowrap;
      &:hover {
        background-color: #3361c6;
      }
    }
  }
</style>