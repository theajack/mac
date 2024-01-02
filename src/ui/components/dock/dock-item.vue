<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { App } from '@/core/apps/app';
import DockTip from './dock-staff.vue';
import DockMenu from './dock-menu.vue';
import AppBlock from '../../components/app-block.vue';
import { useGlobalStore } from '@/ui/store';
import { AppNames } from '@/core/apps/app-config';

const store = useGlobalStore();

const props = defineProps<{
    app: App
}>();

const onClick = () => {
    if (props.app.name !== AppNames.launcher) {
        store.showLauncher = false;
    }
    props.app.onOpen();
};

const contextmenu = (e: MouseEvent) => {
    store.openDockAppMenu(props.app.name);
    e.preventDefault();
};
window.addEventListener('mousedown', e => {
    store.closeDockAppMenu();
});
if (props.app.name === 'trash') {
    // @ts-ignore
    // eslint-disable-next-line vue/no-mutating-props
    props.app.proxy = () => props.app;
}
</script>

<template>
  <div
    class="dock-item"
    :class="{first: app.firstWindowOpen && !app.isVirtualApp}"
    @contextmenu="contextmenu"
    @mousedown.stop
    @click="store.closeDockAppMenu()"
  >
    <div class="dock-icon">
      <AppBlock :app="app" @click="onClick" />
      <DockTip
        v-show="store.dockContextAppName !== app.name"
        :app="app"
        :icon="app.icon"
        @tap-app="onClick"
      />
      <DockMenu :visible="store.dockContextAppName === app.name" :list="app.dockMenu" />
    </div>
    <span
      v-show="app.isRunning && !app.isVirtualApp"
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
