<!--
 * @Author: tackchen
 * @Date: 2022-10-07 21:27:58
 * @Description: Coding something
-->

<script setup lang="ts">

import { resource } from '@/lib/utils';
import { toast } from '../../common/toast/toast';

const onClick = () => {
    toast({
        title: 'Info',
        content: 'under development'
    });
};
</script>

<template>
  <div class="center-item">
    <img
      class="center-icon"
      :src="resource('center/info.png')"
      @click="onClick"
    >
    <div class="center-block">
      11
    </div>
  </div>
</template>

<style scoped lang="less">


</style>