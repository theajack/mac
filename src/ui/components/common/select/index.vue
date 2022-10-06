<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
// import { ref } from 'vue';
import { ISelectItem } from '@/core/types/component';
import List from './list.vue';

defineProps<{
    list: ISelectItem[]
}>();

</script>

<template>
  <List :list="list" />
</template>

