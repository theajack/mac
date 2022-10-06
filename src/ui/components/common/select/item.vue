<!--
 * @Author: tackchen
 * @Date: 2022-10-04 21:44:27
 * @Description: Coding something
-->

<script setup lang="ts">
// import { ref } from 'vue';
import { ISelectItem } from '@/core/types/component';
defineProps<{
    item: ISelectItem
}>();

</script>

<template>
  <div
    class="os-select-item"
    @click="item.onClick"
  >
    <span>{{ item.name }}</span>
  </div>
</template>