<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { Window, WindowCapture } from '@/core/os/window';
import AppStaff from './dock-staff.vue';

const props = defineProps<{
    window: Window,
    capture: WindowCapture
}>();

const onClick = () => {
    props.capture.remove();
    props.window.resume();
};

</script>

<template>
  <div class="dock-item">
    <div
      class="dock-capture"
      :style="{
        'background-image': `url('${capture.icon}')`,
        // 'filter': capture.inited ? 'none' : 'blur(2px)'
      }"
      @click="onClick"
    />
    <AppStaff :app="window.parent" :icon="capture.icon" @tap-app="onClick" />
    <img class="dock-capture-logo" :src="window.parent.icon" alt="">
  </div>
</template>

<style scoped lang="less">
.dock-capture{
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: inline-block;
  width: 45px;
  height: 45px;
}
.dock-capture-logo{
  width: 18px;
  height: 18px;
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
