<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import Select from '../../components/common/select/index.vue';
import type { ISelectItem } from '@/core/types/component';
import PopBg from './pop-bg.vue';

defineProps<{
  list: ISelectItem[],
  visible: boolean,
}>();

</script>

<template>
  <div v-show="visible" class="dock-menu">
    <PopBg background-color="#4447" :left="'20px'" />
    <Select :list="list" :background="false" />
  </div>
</template>

<style scoped lang="less">
.dock-menu{
    position: absolute;
    z-index: 10;
    top: -30px;
    left: calc(50% - 20px);
    transform: translate(0%, -100%);
}
</style>

