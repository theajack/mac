<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { desktop } from '@/ui/desktop/desktop';
import { DockItem } from '@/ui/desktop/dock-item';
// import { ref } from 'vue';
const props = defineProps<{
    name: string;
    icon: string;
}>();

new DockItem(props);

console.warn(desktop.dock);
</script>

<template>
  <div class="dock-item">
    <img src="@/ui/assets/icons/app-store.png">
  </div>
</template>

<style scoped lang="less">
.dock-item {
    color: #42b983;
    flex: 1;
    margin-right: 12px;
    &:last-child{
      margin-right: 0;
    }
    img {
        width: 45px;
        height: 45px;
    }
}
</style>
