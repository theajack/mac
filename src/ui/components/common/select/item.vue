<!--
 * @Author: tackchen
 * @Date: 2022-10-04 21:44:27
 * @Description: Coding something
-->

<script setup lang="ts">
// import { ref } from 'vue';
import type { ISelectItem } from '@/core/types/component';
import List from './list.vue';
import { computed, ref } from 'vue';
import { CommonMargin, WinHeightNoDock, WindowWidth } from '@/ui/style/common';
const props = withDefaults(defineProps<{
    item: ISelectItem,
    parentOverScreen?: boolean,
}>(), {
    parentOverScreen: false,
});
const isOverScreen = ref(false);
const top = ref(-5);

const listParent = ref();

const enterSelect = () => {
    const el = listParent.value?.children[2];
    if (!el) return;
    isOverScreen.value = props.parentOverScreen;
    const { right, bottom } = el.getBoundingClientRect();
    if (!props.parentOverScreen) {
        if (right > WindowWidth - CommonMargin) {
            isOverScreen.value = true;
        }
    }
    if (bottom > WinHeightNoDock) {
        top.value = -(bottom - WinHeightNoDock + 5);
    }
};

const leaveSelect = () => {
    isOverScreen.value = false;
    top.value = -5;
};

const topPx = computed(() => `${top.value}px`);

const onclick = (e: MouseEvent) => {
    if (props.item.disabled) {
        e.preventDefault();
        return;
    }
    props.item.onClick?.(props.item);
};

</script>

<template>
  <div
    class="os-select-item"
    :class="{
      'is-split': item.isSplit,
      'disabled': item.disabled,
    }"
    @click="onclick"
    @mouseenter="enterSelect"
    @mouseleave="leaveSelect"
  >
    <div
      v-if="item.isSplit"
      class="os-select-split"
    />
    <div v-else ref="listParent" class="os-select-child">
      <span class="os-select-title">{{ item.name }}</span>
      <i v-if="item.children" class="ei-angle-right" />
      <List
        v-if="item.children"
        :is-over-screen="parentOverScreen || isOverScreen"
        :is-child="true"
        :list="item.children"
      />
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
    top: 4px;
  }
  >.os-select-child{

    >.os-select-list{
      position: absolute;
      z-index: 1;
      right: 0;
      transform: translateX(100%);
      top: v-bind(topPx);
      display: none;
    }
    >.os-select-title{
      margin-right: 20px;
    }
  }
  &:hover {
    background-color: #3361c6;
    >.os-select-child>.os-select-list{
      display: block;
    }
  }
  &.is-split:hover {
    background-color: transparent;
  }
  .os-select-split{
    border-top: 1px solid var(--color-white-200);
  }
  &.disabled{
    color: #5c5c5c;
    &:hover {
      background-color: transparent;
      >.os-select-child>.os-select-list{
        display: none;
      }
    }
  }
}
</style>
