<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
// import { ref } from 'vue';
import type { ISelectList, ISelectItem } from '@/core/types/component';
import Item from './item.vue';
const props = withDefaults(defineProps<{
    list: ISelectItem[],
    background?: boolean,
    isChild?: boolean,
    isOverScreen?: boolean,
}>(), {
    background: true,
    isChild: false,
    isOverScreen: false,
});

// eslint-disable-next-line vue/no-mutating-props
(props.list as ISelectList).proxy = () => props.list;

</script>

<template>
  <div
    class="os-select-list"
    :class="{
      'bg-blur': background,
      'overscreen': isOverScreen
    }"
  >
    <Item
      v-for="item in list"
      :key="item.name"
      :parent-over-screen="isOverScreen"
      :item="item"
      class="os-select-item"
    />
  </div>
</template>

<style lang="less">
  .os-select-list {
    position: relative;
    user-select: none;
    color: #fff;
    min-width: 100px;
    display: inline-block;
    padding: 5px;
    .os-select-item {
      position: relative;
    }
    &.overscreen{
      left: 0!important;
      right: auto!important;;
      transform: translateX(-100%)!important;
    }
  }
</style>