<!--
 * @Author: tackchen
 * @Date: 2022-10-04 21:44:27
 * @Description: Coding something
-->

<script setup lang="ts">
// import { ref } from 'vue';
import { ISelectItem } from '@/core/types/component';
import List from './list.vue';
defineProps<{
    item: ISelectItem
}>();

</script>

<template>
  <div
    class="os-select-item"
    :class="{'is-split': item.isSplit}"
    @click="item.onClick"
  >
    <div
      v-if="item.isSplit"
      class="os-select-split"
    />
    <div v-else>
      <span class="os-select-title">{{ item.name }}</span>
      <i v-if="item.children" class="ei-angle-right" />
      <List v-if="item.children" :list="item.children" />
    </div>
  </div>
</template>
<style lang="less">
.os-select-item {
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 13px;
  margin: 2px 0;
  .ei-angle-right{
    position: absolute;
    right: 3px;
    font-size: 15px;
    top: 2px;
  }
  .os-select-list{
    position: absolute;
    z-index: 1;
    right: 0;
    transform: translateX(100%);
    top: -5px;
    display: none;
  }
  .os-select-title{
    margin-right: 20px;
  }
  &:hover {
    background-color: #3361c6;
    .os-select-list{
      display: block;
    }
  }
  &.is-split:hover {
    background-color: transparent;
  }
  .os-select-split{
    border-top: 1px solid var(--color-white-200);
  }
}
</style>
