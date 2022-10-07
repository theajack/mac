<!--
 * @Author: tackchen
 * @Date: 2022-10-05 17:04:40
 * @Description: Coding something
-->

<script setup lang="ts">
import { toast } from '../../common/toast/toast';

const onClick = () => {
    toast({
        title: 'Battery',
        content: 'In developing'
    });
};
</script>

<template>
  <div class="center-item">
    <img
      class="center-icon"
      src="/mac/assets/center/battery.png"
      @click="onClick"
    >
    <div class="center-block">
      11
    </div>
  </div>
</template>

<style scoped lang="less">


</style>