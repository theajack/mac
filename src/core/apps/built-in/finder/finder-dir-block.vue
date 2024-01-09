<!--
 * @Author: chenzhongsheng
 * @Date: 2024-01-06 23:34:35
 * @Description: Coding something
-->
<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { createFinderStore } from './js/finder-store';
import type { IFindMenuItem } from './js/finder-menu-data';
const props = defineProps<{
    id: number,
    list: IFindMenuItem[],
    title: string,
    isTag?: boolean,
    bgImage?: string,
}>();
const store = createFinderStore(props.id);

const chooseItem = (item: any) => {
    store.activeFinderItemName = item.name;
};

</script>

<template>
  <div class="left-title">{{ title }}</div>
  <div class="finder-item-w flex flex-col mt-1">
    <div
      v-for="item in list" :key="item.name"
      class="finder-item flex items-center"
      :class="{active: store.activeFinderItemName===item.name}"
      @click="chooseItem(item)"
    >
      <i
        class="left-icon"
        :class="{tag: isTag}"
        :style="isTag ? {
          backgroundColor: item.color,
          border: `1px solid ${item.border || item.color}`
        }: {
          backgroundImage: `url(${bgImage})`,
          'background-position-y': `-${item.posY}px`,
        }"
      />
      <span class="left-name">{{ item.name }}</span>
    </div>
  </div>
</template>

<style scoped lang="less">

.left-title{
    font-size: 12px;
    color: #aaa;
    font-weight: bold;
    margin-top: 15px;
    &:first-child{
       margin-top: 0;
    }
}
.left-icon{
    width: 22px;
    height: 22px;
    background-size: 22px;
    &.tag {
        margin: 0 7px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
}
.left-name{
    font-size: 13px;
    margin-left: 5px;
}
.finder-item-w{
  gap: 2px;
  padding-right: 10px;
}
.finder-item {
    padding: 3px 2px;
    border-radius: 5px;
    &.active{
        background-color: #fff2;
    }
}
</style>

./js/finder-store./js/finder-menu-data