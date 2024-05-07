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
import Launcher from './launcher.vue';
import { useContextMenuRef } from '../components/common/context-menu/context-menu';
import { resource } from '@/lib/utils';

const { contextmenu } = useContextMenuRef();

</script>

<template>
  <div
    class="desktop-container bg-cover"
    :style="{'background-image': `url(${resource('desktop-bg.jpg')})`}"
    @contextmenu.self="contextmenu"
  >
    <Launcher />
    <Loading />
    <StatusBar />
    <DockBar />
    <Toast />
    <ContextMenu />
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
}
</style>
