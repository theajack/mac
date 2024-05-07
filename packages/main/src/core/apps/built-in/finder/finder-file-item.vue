
<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { useFinderStore, type IFileInfo } from './js/finder-store';
import { FinderUtils } from './js/finder-utils';
import { useContextMenuRef } from '@/ui/components/common/context-menu/context-menu';
import { FileMenu, FolderMenu } from './js/finder-context-menu';
import { FileLength } from './js/finder-layout-manager';
import { computed } from 'vue';
const props = defineProps<{
    id: number,
    file: IFileInfo
}>();

const img = computed(() => FinderUtils.chooseFileImage(props.file));
const { contextmenu } = useContextMenuRef(props.file.isDir ? FolderMenu : FileMenu);

const store = useFinderStore(props.id);
const fileContextMenu = (e: MouseEvent) => {
    if (!store.activeIds.has(props.file.id)) {
        store.chooseSingleFile(props.file.id);
    }
    contextmenu(e);
};

const onNameKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        // @ts-ignore
        e.target.blur();
    }
};


// // 选择文件
// const clickFile = (e: MouseEvent) => {
//     if (e.metaKey || e.ctrlKey) {
//         // 多选
//     } else {

//     }
// };

</script>

<template>
  <div
    class="file-item items-start flex-col"
    :class="{active: store.activeIds.has(file.id+'')}"
    :data-dir="file.isDir"
    :data-id="file.id"
    :data-path="file.path"
    data-type="file"
    @contextmenu.capture.stop="fileContextMenu"
  >
    <div class="img-w relative">
      <img :src="img" alt="" :style="`height: ${FileLength}px; width: ${FileLength}px`">
      <i v-if="file.isSystemFile" class="ei-lock img-marker" />
      <i v-else-if="FinderUtils.isInTrash(file.path)" class="ei-trash img-marker" />
    </div>
    <div
      :id="`file-name-input-${props.id}-${file.id}`"
      class="file-name"
      :contenteditable="file.isEdit"
      @blur="e => store.saveFileName(e, file)"
      @keydown="onNameKeyDown"
    >
      {{ file.name }}
    </div>
  </div>
</template>


<style scoped lang="less">
.file-item{
    pointer-events: all;
    width: 70px;
    user-select: none;
    height: fit-content;
    * {
        pointer-events: none;
    }
    .img-w{
        img{
            padding: 3px;
        }
        .img-marker{
            position: absolute;
            right: 2px;
            bottom: 2px;
            filter: drop-shadow(1px 1px 1px #222d) drop-shadow(-1px 1px 1px #222d);
        }
    }
    .file-name{
        width: 100%;
        text-align: center;
        margin-top: 3px;
        border-radius: 5px;
        padding: 2px;
        font-size: 13px;
        flex-shrink: 0;
        word-break: break-all;
        &[contenteditable=true]{
            outline: none;
            pointer-events: all;
            box-shadow: 2px 2px 0 0 #3a668e, -2px -2px 0 0 #3a668e, 2px -2px 0 0 #3a668e,-2px 2px 0 0 #3a668e;
            background-color: transparent!important;
        }
    }
    &.active{
        img{
            background-color: #fff2;
        }
        .file-name{
            background-color: #2458ca;
        }

    }
}
</style>