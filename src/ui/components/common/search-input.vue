<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { ref, watch } from 'vue';

withDefaults(defineProps<{
    modelValue: string,
    placeholder?: string,
    defWidth?: number,
    width?: number,
}>(), {
    placeholder: 'Search',
    defWidth: 46,
    width: 300,
});

const emit = defineEmits<{
    'update:modelValue': [string],
}>();

const isFocus = ref(false);
const value = ref('');

watch(value, () => {
    emit('update:modelValue', value.value);
});

</script>

<template>
  <div
    class="c-search-input-w text-ell" :class="{focus: isFocus}"
    :style="{width: `${width}px`}"
    @click.stop="isFocus = true"
  >
    <i class="el-search" />
    <input
      ref="queryInput"
      v-model="value"
      :style="{width: `${isFocus ? width: defWidth}px`}"
      class="search-input"
      type="text"
      :placeholder="placeholder"
      @mousedown.stop
      @click.stop
      @focus="isFocus = true"
      @blur="isFocus = false"
    >
  </div>
</template>

<style scoped lang="less">
@import url(@/ui/style/common.less);
.c-search-input-w{
    cursor: text;
    background-color: rgb(42,42,42);
    width: 400px;
    height: 28px;
    padding: 0 8px;
    border-radius: 5px;
    width: fit-content;
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

