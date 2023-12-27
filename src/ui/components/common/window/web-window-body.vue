<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { IWindowStatus } from '@/core/os/window/window';
import IFrame from '@/ui/components/common/iframe.vue';
defineProps<{
    status: IWindowStatus
}>();
</script>

<template>
  <IFrame :url="status.url" />
</template>

<style scoped lang="less">
</style>