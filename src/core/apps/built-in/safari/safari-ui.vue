<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { createSafariStore, type ITabItem } from './safari-store';
import SafariStart from './safari-start.vue';
import { createDragScope } from '@/ui/lib/drag-scope';
import type { IWindowStatus } from '@/core/os/window/window';
import IFrame from '@/ui/components/common/iframe.vue';
const props = defineProps<{
    status: IWindowStatus
}>();
const store = createSafariStore(props.status.id);

const TabHeight = 28;

const {
    dragActiveId,
    dragstart,
    dragend,
    dragenter,
    drop
} = createDragScope({
    dragClass: 'tab-item',
    ondragfinish (src, target) {
        // console.warn('ondragfinish', src, target);
        store.dragTabIndex(src, target);
    }
});

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
        :data-id="item.id"
        draggable="true"
        class="tab-item text-ell"
        :class="{
          active: store.activeId === item.id,
          'drag-active': dragActiveId === item.id,
        }"
        @click="clickTab(item)"
        @dragenter.prevent="dragenter"
        @dragstart="dragstart"
        @dragend="dragend"
        @drop="drop"
        @dragover.prevent
      >
        <i class="el-close" @click.stop="store.close(item.id)" />
        <i :class="item.icon" />
        <span>{{ item.title }}</span>
      </div>
    </div>
    <div
      class="h-full" :style="{
        height: store.showTab ? `calc(100% - ${TabHeight}px)`: '100%'
      }"
    >
      <div
        v-for="(item) in store.tabs"
        v-show="store.activeId === item.id"
        :id="`SAFARI_ITEM_${status.id}_${item.id}`"
        :key="item.id"
        class="h-full"
      >
        <SafariStart v-if="item.isStart" :id="status.id" />
        <IFrame v-else :url="item.url" />
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
    user-select: none;
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
    &.drag-active{
      background-color: #666;
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

