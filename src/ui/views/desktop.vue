<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:07:35
 * @Description: Coding something
-->
<script setup lang="ts">
import StatusBar from '../components/status/status-bar.vue';
import DockBar from '../components/dock/dock-bar.vue';
import Toast from '../components/common/toast/toast.vue';
import ContextMenu from '../components/common/context-menu/context-menu.vue';
import AppManager from '../components/app-manager.vue';
import Loading from './loading.vue';
import { useGlobalStore } from '@/ui/store';

const store = useGlobalStore();

// const {
//     position,
//     visible,
//     contextmenu
// } = createContextMenuRef();

</script>

<template>
  <div class="desktop-container">
    <Loading />
    <StatusBar />
    <DockBar />
    <Toast />
    <ContextMenu
      :list="store.deskTopMenuList"
    />
    <AppManager />
  </div>
</template>

<style scoped>
.desktop-container {
  color: white;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-image: url('/assets/desktop-bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
