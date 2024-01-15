
<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { resource } from '@/lib/utils';
import { useFinderStore } from './js/finder-store';
import FinderMenuBlock from './finder-dir-block.vue';
import FinderFile from './finder-file-item.vue';
import { faviList, iCloudList, tagList } from './js/finder-menu-data';
import { useContextMenuRef } from '@/ui/components/common/context-menu/context-menu';
import { MainFinderMenu } from './js/finder-context-menu';
import type { IWindowCompProp } from '@/core/os/window/window';
const props = defineProps<IWindowCompProp>();
const store = useFinderStore(props.id);
// todo 滑动选择多个
const { contextmenu } = useContextMenuRef(MainFinderMenu);
const clickFinder = (e: MouseEvent) => {
    const el = e.target as HTMLElement;

    const type = el.dataset.type;

    switch (type) {
        case 'finder':
            store.activeIds.clear();
            break;
        case 'file':
            const id = parseInt(el.dataset.id as string);
            if (e.metaKey || e.ctrlKey) {
                if (store.activeIds.has(id)) {
                    store.activeIds.delete(id);
                } else {
                    store.activeIds.add(id);
                }
            } else {
                store.chooseSingleFile(id);
            }
            break;
        default: return;
    }
};
</script>

<template>
  <div
    class="flex-center text-white h-full"
    @contextmenu.prevent
  >
    <div class="left-block cursor-default select-none bg-header-op h-full" :style="{width: `${store.leftPanelWidth}px`}">
      <FinderMenuBlock :id="id" :list="faviList" title="Favorites" :bg-image="resource('finder-icons.png')" />
      <FinderMenuBlock :id="id" :list="iCloudList" title="iClouds" :bg-image="resource('finder-icons-2.png')" />
      <FinderMenuBlock :id="id" :list="tagList" title="Tags" :is-tag="true" />
    </div>
    <div
      data-type="finder"
      class="right-block flex-1 h-full flex bg-header overflow-auto"
      @click="clickFinder"
      @contextmenu.stop="contextmenu"
    >
      <div
        data-type="finder"
        class="flex gap-8 flex-wrap h-fit flex-1 p-8"
      >
        <FinderFile
          v-for="item in store.curDirInfo"
          :id="id"
          :key="item.id"
          :file="item"
        />
      </div>
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
.right-block{
  background-color: #222;
}
</style>

./js/finder-store./js/finder-menu-data