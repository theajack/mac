<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:07:35
 * @Description: Coding something
-->
<script setup lang="ts">
import StatusBar from '../components/status/status-bar.vue';
import DockBar from '../components/dock/dock-bar.vue';
import { ref } from 'vue';
import { a } from '../components/a';
console.log(a);
defineProps({
    msg: String
});

const count = ref(0);
</script>

<template>
  <div class="desktop-container">
    <StatusBar />
    <div>{{ count }}</div>
    <DockBar />
  </div>
</template>

<style scoped>
.desktop-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-image: url('../assets/desktop-bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
