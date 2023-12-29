<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { App } from '@/core/apps/app';
import AppStaff from './dock-staff.vue';
import AppBlock from '../../components/app-block.vue';

const props = defineProps<{
    app: App
}>();

const onClick = () => {
    props.app.onOpen();
};

</script>

<template>
  <div
    class="dock-item"
    :class="{first: app.status.firstWindowOpen}"
  >
    <div class="dock-icon">
      <AppBlock :app="app" :height="48" @click="onClick" />
      <AppStaff :app="app" :icon="app.icon" @tap-app="onClick" />
    </div>
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
    .dock-icon{
      transform: translateY(0);
    }
    &.first{
      .dock-icon {
        animation: dock-jump .8s ease-in-out;
      }
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
