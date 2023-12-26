<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { App } from '@/core/apps/app';
import AppStaff from './dock-staff.vue';

const props = defineProps<{
    app: App
}>();

const onClick = () => {
    props.app.onOpen();
};

</script>

<template>
  <div class="dock-item">
    <img :src="app.icon" :class="{first: app.status.firstWindowOpen}" @click="onClick">
    <AppStaff :app="app" :icon="app.icon" @tap-app="onClick" />
    <span
      v-show="app.isRunning"
      class="dock-dot"
    />
  </div>
</template>

<style lang="less">
@import '@/ui/style/common.less';
@keyframes dock-jump {
  0% { transform: translateY(0);}
  50% { transform: translateY(-15px);}
  100% { transform: translateY(0px);}
}
.dock-item {
    flex: 1;
    margin-right: 12px;
    position: relative;
    flex-shrink: 0;
    &:last-child{
      margin-right: 0;
    }
    img {
      height: 45px;
      &.first{
        animation: dock-jump .8s ease-in-out;
      }
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
