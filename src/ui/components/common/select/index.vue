<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
// import { ref } from 'vue';
import type { ISelectItem } from '@/core/types/component';
import List from './list.vue';

withDefaults(defineProps<{
    list: ISelectItem[],
    background?: boolean,
}>(), {
    background: true
});

</script>

<template>
  <List :list="list" :background="background" />
</template>

