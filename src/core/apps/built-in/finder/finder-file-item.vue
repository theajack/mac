
<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { resource } from '@/lib/utils';
import type { IFileInfo } from './finder-store';
const props = defineProps<{
    id: number,
    file: IFileInfo
}>();
const img = resource(props.file.isDir ? 'folder.png' : 'file.png');
</script>

<template>
  <div class="file-item flex-center flex-col">
    <img :src="img" alt="">
    <div class="file-name">{{ file.name }}</div>
  </div>
</template>


<style scoped lang="less">
.file-item{
    width: 70px;
    height: 90px;
}
</style>

