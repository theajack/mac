<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { ref, watch } from 'vue';
import { createSafariStore } from './safari-store';
import type { IWindowStatus } from '@/core/os/window/window';
import { underDevelopment } from '@/ui/components/common/toast/toast';

const props = defineProps<{
    status: IWindowStatus
}>();
const store = createSafariStore(props.status.id);
const queryInput = ref();
const widthEle = ref();
function queryKeyDown (e: KeyboardEvent) {
    if (e.key === 'Enter' && e.keyCode === 13) {
        store.startQuery();
        queryInput.value.blur();
    }
}
watch(() => store.placeholder, () => {
    setTimeout(() => {
        store.initInputWidth(widthEle.value);
    }, 0);
});
function inputFocus () {
    store.focusInput();
    store.initInputWidth(widthEle.value);
    setTimeout(() => {
        queryInput.value.select();
    }, 0);
}
function inputBlur () {
    store.isFocus = false;
    if (store.isEmptyQuery) {
        store.query = '';
        store.initInputWidth(widthEle.value);
    }
}
store.newTab();
</script>

<template>
  <div class="flex items-center justify-between w-full h-full" style="background-color: rgb(56,56,56);">
    <!-- 为了使input居中 -->
    <span class="flex gap-2 text-lg relative" style="left: 76px;margin-right: 32px;">
      <i class="el-arrow-left safari-icon" @click.stop="store.forward" />
      <i class="el-arrow-right safari-icon" @click.stop="store.back" />
    </span>
    <div
      class="search-input-w text-ell" :class="{focus: store.isFocus}"
      @click="queryInput.focus()"
    >
      <div>
        <i :class="(store.isStartPage || store.isFocus || store.query) ? 'el-search': 'ei-lock'" />
        <!-- <span style="opacity: 0;">{{ store.query }}</span> -->
        <input
          ref="queryInput"
          v-model="store.query"
          class="search-input"
          type="text"
          :placeholder="store.placeholder"
          :style="{width: store.inputWidth + 'px'}"
          @input="store.isUrlAsQuery = false"
          @mousedown.stop
          @click.stop
          @focus="inputFocus"
          @blur="inputBlur"
          @keydown="queryKeyDown"
        >
        <span ref="widthEle" class="search-input count-width">{{ store.placeholder }}</span>
      </div>
    </div>
    <span class="flex gap-2 text-lg relative" style="right: 15px">
      <i class="el-upload2 safari-icon" @click.stop="underDevelopment" />
      <i class="el-plus safari-icon" @click.stop="store.newTab" />
      <i class="el-copy-document safari-icon" @click.stop="underDevelopment" />
    </span>
  </div>
</template>

<style scoped lang="less">
@import url(@/ui/style/common.less);
.safari-icon {
    .common-icon;
}
.search-input-w{
    cursor: text;
    background-color: rgb(42,42,42);
    width: 400px;
    height: 28px;
    padding: 0 8px;
    border-radius: 5px;
    .flex-center;
    border: 3px solid rgb(56,56,56);
    transition: border-color .3s ease;
    .search-input{
        padding-left: 4px;
        background-color: inherit;
        outline: none;
        border: none;
        transition: width .3s ease;
        font-size: 13px;
        &.count-width{
            width:auto;
            visibility: hidden;
            position: absolute;
            z-index: -1000;
            opacity: 0;
        }
    }
    user-select: none;
    &.focus{
        user-select: auto;
        border-color: rgb(52,113,156);
    }
}
</style>

