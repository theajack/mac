<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { Window } from '@/core/os/window';
import AppStaff from './dock-staff.vue';

const props = defineProps<{
    window: Window,
}>();

const onClick = () => {
    props.window.resume();
};

</script>

<!-- :style="{
  'background-image': `url('${capture.icon}')`,
  // 'filter': capture.inited ? 'none' : 'blur(2px)'
}" -->
<template>
  <div class="dock-item dock-capture-item">
    <div
      class="dock-capture"
    />
    <div class="dock-capture-mask" @click="onClick" />
    <AppStaff :app="window.parent" @tap-app="onClick" />
    <img class="dock-capture-logo" :src="window.parent.icon" alt="">
  </div>
</template>

<style scoped lang="less">
.dock-capture-item{
  width: 0px;
  margin-right: 0;
  height: 45px;
  transition: all .5s linear;

    // width: 45px;
    // margin-right: 12px;


  .dock-capture{
    position: relative;
    z-index: 1;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    display: inline-block;
    height: 45px;
    width: 45px;
  }

  .dock-capture-mask {
    position: absolute;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
  }
  .dock-capture-logo{
    width: 18px;
    height: 18px;
    position: absolute;
    z-index: 3;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity .5s linear;
  }

  &.animation{
    width: 45px;
    margin-right: 12px;
    .dock-capture-logo{
      opacity: 1;
    }
  }
}
</style>
@/core/os/window/window