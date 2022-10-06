<!--
 * @Author: tackchen
 * @Date: 2022-10-04 21:44:27
 * @Description: Coding something
-->

<script setup lang="ts">
// import { ref } from 'vue';
import { ISelectItem } from '@/core/types/component';
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
  .os-select-title{
    margin-right: 20px;
  }
  &:hover {
    background-color: #3361c6;
  }
  &.is-split:hover {
    background-color: transparent;
  }
  .os-select-split{
    border-top: 1px solid var(--color-white-200);
  }
}
</style>
