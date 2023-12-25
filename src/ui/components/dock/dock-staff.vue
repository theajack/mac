<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { App } from '@/core/apps/app';
import PopBg from './pop-bg.vue';

defineProps<{
    app: App
}>();

</script>

<template>
  <div class="dock-title">
    <!-- 简单方案 会看到箭头后面有横线 但是兼容性比较好 -->
    <!-- <div class="dock-title-bg-angle" /> -->
    <PopBg />
    <span>{{ app.title }}</span>
  </div>
</template>

<style scoped lang="less">
@import '@/ui/style/common.less';
.dock-item {
    flex: 1;
    margin-right: 12px;
    position: relative;
    &:last-child{
      margin-right: 0;
    }
    img {
        // width: 45px;
        height: 45px;
    }
    .dock-title{
      padding: 5px 13px;
      left: 50%;
      transform: translateX(-50%);
      position: absolute;
      white-space: nowrap;
      top: -55px;
      display: none;
    }
    // .dock-title{
    //   .common-bg;
    //   padding: 5px 13px;
    //   left: 50%;
    //   transform: translateX(-50%);
    //   position: absolute;
    //   white-space: nowrap;
    //   top: -60px;
    //   display: none;
    //   .dock-title-bg-angle{
    //     display: inline-block;
    //     position: absolute;
    //     left: 50%;
    //     bottom: -9px;
    //     width: 20px;
    //     height: 9px;
    //     transform: translateX(-50%);
    //     overflow: hidden;
    //     &:after {
    //       content: " ";
    //       .common-bg;
    //       content: " ";
    //       transform: rotate(45deg) translateX(-50%);
    //       border-radius: 2px;
    //       display: inline-block;
    //       position: absolute;
    //       top: -1px;
    //       left: 43%;
    //     }
    //   }
    // }

    &:hover .dock-title{
      display: block;
    }
    .dock-dot{
      width: 4px;
      height: 4px;
      position: absolute;
      display: inline-block;
      background-color: #9d90bf;
      border-radius: 50%;
      bottom: -9px;
      left: 50%;
      transform: translateX(-50%);
    }
}
</style>
