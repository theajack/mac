

<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { IFavorite } from './safari-store';
const props = defineProps<{
    item: IFavorite
}>();
const color = props.item.color || '#676968';
</script>

<template>
  <span
    class="fav-icon flex-shrink-0" :style="{
      backgroundColor: item.src ? 'transparent': item.bg,
      color: color
    }"
  >
    <i v-if="item.icon" :class="item.icon" />
    <img v-else-if="item.src" :src="item.src" :style="{scale: item.scale ? 1.3: 1}">
    <span v-else-if="item.svg" class="svg" v-html="item.svg" />
    <span v-else>{{ item.short || item.name[0].toUpperCase() }}</span>
    <i v-if="!item.iframe" class="el-link" />
  </span>
</template>

<style lang="less">
@import url(@/ui/style/common.less);
.fav-icon{
    cursor: default;
    position: relative;
    background-color: #f2f2f2;
    border-radius: 10px;
    width: 58px;
    height: 58px;
    overflow: hidden;
    .flex-center;
    font-size: 40px;
    .ei-github::before{
        position: relative;
        left: 3px;
    }
    .el-link{
        position: absolute;
        font-size: 15px;
        bottom: 0;
        right: 0;
        color: #000;
    }
    img {
        border-radius: 14px;
    }
    .svg {
        scale: 1.6;
        // path {
        //     stroke: v-bind(color);
        // }
    }
}
</style>

