
<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { resource } from '@/lib/utils';
import type { IFileInfo } from './js/finder-store';
import { useContextMenuRef } from '@/ui/components/common/context-menu/context-menu';
import { FileMenu, FolderMenu } from './js/finder-context-menu';
const props = defineProps<{
    id: number,
    file: IFileInfo
}>();
const img = resource(props.file.isDir ? 'folder.png' : 'file.png');
const { contextmenu } = useContextMenuRef(props.file.isDir ? FolderMenu : FileMenu);
</script>

<template>
  <div class="file-item flex-center flex-col" :data-dir="file.isDir" @contextmenu.capture.stop="contextmenu">
    <img :src="img" alt="">
    <div class="file-name">{{ file.name }}</div>
  </div>
</template>


<style scoped lang="less">
.file-item{
    width: 70px;
    height: 90px;
    user-select: none;
}
</style>

./js/finder-store