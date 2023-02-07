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
// import Select from '../components/common/select/index.vue';
// import { Ref, ref } from 'vue';
// import { ISelectItem } from '@/core/types/component';
// import { a } from '../components/a';
// console.log(a);
defineProps({
    msg: String
});

// const selectList: Ref<ISelectItem[]> = ref([
//     { name: 'aaa', onClick () {console.log(1);} },
//     { name: 'bbb', onClick () {console.log(1);} },
// ]);

// const count = ref(0);

// const origin = { a: 1 };

// const data = ref(origin);
// const data2 = ref(origin);

// (window as any).data = data;

</script>

<template>
  <div class="desktop-container">
    <StatusBar />
    <!-- <Select :list="selectList" /> -->
    <!-- <div>{{ count }}</div> -->
    <!-- <div>status bar: {{ data.a }}</div> -->
    <!-- <div>status bar: {{ data2.a }}</div> -->
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
  background-image: url('/assets/desktop-bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
