<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { useSafariStore, type ITabItem } from './safari-store';
import SafariStart from './safari-start.vue';
const store = useSafariStore();

const TabHeight = 28;

function clickTab (item: ITabItem) {
    store.setActiveId(item.id);
}
</script>

<template>
  <div class="h-full" style="background-color: rgba(39,39,39,.8);">
    <div v-show="store.showTab" class="tab-w" :style="`height: ${TabHeight}px`">
      <div
        v-for="(item) in store.tabs"
        :key="item.id"
        class="tab-item"
        :class="{active: store.activeId === item.id}"
        @click="clickTab(item)"
      >
        <i class="el-close" @click.stop="store.close" />
        <i :class="item.icon" />
        <span>{{ item.title }}</span>
      </div>
    </div>
    <div
      class="h-full" :style="{
        height: store.showTab ? `calc(100% - ${TabHeight}px)`: '100%'
      }"
    >
      <div v-for="(item) in store.tabs" v-show="store.activeId === item.id" :key="item.id" class="h-full">
        <SafariStart v-if="item.isStart" />
        <iframe
          v-else
          :id="`SAFARI_IFRAME_${item.id}`"
          class="w-full h-full"
          :src="item.url" frameborder="0"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import url(@/ui/style/common.less);
.tab-w{
  display: flex;
  .tab-item{
    cursor: default;
    flex: 1;
    height: 100%;
    font-size: 11px;
    gap: 4px;
    border-right: 1px solid rgb(73,73,73);
    position: relative;
    background-color: rgb(29,29,29);
    transition: background-color .3s ease;
    .flex-center;
    i{
      font-size: 14px;
    }
    &:last-child{
      border: none;
    }
    &.active{
      background-color: rgb(53,53,53);
    }

    .el-close{
      .common-icon;
      height: 16px;
      position: absolute;
      left: 3px;
      opacity: 0;
      transition: opacity .3s ease;
    }
    &:hover{
      background-color: rgb(45,45,45);
      .el-close{
        opacity: 1;
      }
    }
  }
}
</style>

