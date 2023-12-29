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
      text-align: center;
      left: 50%;
      transform: translateX(-50%);
      position: absolute;
      white-space: nowrap;
      top: -55px;
      display: none;
    }

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
