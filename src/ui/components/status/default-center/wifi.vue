<!--
 * @Author: tackchen
 * @Date: 2022-10-07 21:27:34
 * @Description: Coding something
-->

<script setup lang="ts">

import { toast } from '../../common/toast/toast';

const onClick = () => {
    toast({
        title: 'Wifi',
        content: 'In developing'
    });
};
</script>

<template>
  <div class="center-item">
    <img
      class="center-icon"
      src="/mac/assets/center/wifi.png"
      @click="onClick"
    >
    <div class="center-block">
      11
    </div>
  </div>
</template>

<style scoped lang="less">


</style>