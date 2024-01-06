
<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { resource } from '@/lib/utils';
import { createFinderStore } from './finder-store';
import FinderMenuBlock from './finder-dir-block.vue';
import { faviList, iCloudList, tagList } from './finder-menu-data';
const props = defineProps<{
    id: number
}>();
const store = createFinderStore(props.id);
</script>

<template>
  <div class="flex-center text-white h-full">
    <div class="left-block cursor-default select-none bg-header-op h-full" :style="{width: `${store.leftPanelWidth}px`}">
      <FinderMenuBlock :id="id" :list="faviList" title="Favorites" :bg-image="resource('finder-icons.png')" />
      <FinderMenuBlock :id="id" :list="iCloudList" title="iClouds" :bg-image="resource('finder-icons-2.png')" />
      <FinderMenuBlock :id="id" :list="tagList" title="Tags" :is-tag="true" />
    </div>
    <div class="flex-1 px-2 h-full flex items-center bg-header">
      underDevelopment
    </div>
  </div>
</template>


<style scoped lang="less">
@import url(./finder.less);
.left-block{
  padding-left: 10px;
  overflow: auto;
  padding-bottom: 10px;
}
</style>

