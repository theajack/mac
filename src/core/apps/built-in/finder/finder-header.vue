<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { IWindowCompProp } from '@/core/os/window/window';
import { useFinderStore } from './js/finder-store';
const props = defineProps<IWindowCompProp>();
const store = useFinderStore(props.id);
</script>

<template>
  <div
    class="flex items-center w-full h-full"
    @contextmenu.prevent
  >
    <div class="left-block h-full" :style="{width: `${store.leftPanelWidth}px`}" />
    <div
      class="flex-1 px-2 h-full flex items-center bg-header finder-top-shadow
        select-none cursor-default justify-between"
    >
      <span class="flex flex-1">
        <i class="el-arrow-left common-icon" @click.stop />
        <i class="el-arrow-right common-icon" @click.stop />
        <span class="px-2 flex-center font-bold">{{ store.curDirName }}</span>
      </span>

      <span class="common-icon large mr-10" @click.stop>
        <i class="et-mode-icon" />
        <i class="el-d-caret scale-90" />
      </span>

      <span class="flex gap-3 mr-10" @click.stop>
        <span class="common-icon large">
          <i class="ei-th" />
          <i class="ei-angle-down l-m scale-90" />
        </span>
        <i class="el-upload2 common-icon scale-110" />
        <i class="et-tag common-icon scale-110" />
        <span class="common-icon large">
          <i class="et-waiting" />
          <i class="ei-angle-down l-m scale-90" />
        </span>
      </span>
      <span class="flex gap-3 mr-3" @click.stop>
        <span class="common-icon large">
          <i class="el-thumb" />
          <i class="ei-angle-down l-m scale-90" />
        </span>
        <i class="el-search common-icon" />
      </span>
    </div>
  </div>
</template>

<style scoped lang="less">
@import url(./finder.less);
.common-icon{
    font-size: 18px;
    &.large{
        aspect-ratio: 1.6/1;
        height: 28px;
    }
    i.l-m{
        margin-left: 3px;
    }
}
</style>

./js/finder-store