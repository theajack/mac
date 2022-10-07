<!--
 * @Author: tackchen
 * @Date: 2022-10-07 21:27:58
 * @Description: Coding something
-->

<script setup lang="ts">
import { ref } from 'vue';
import { buildDate } from '@/lib/utils';
import { toast } from '../../common/toast/toast';

const dateObject = ref(buildDate());

const onClick = () => {
    toast({
        title: 'Date time:',
        content: `${dateObject.value.date}-${dateObject.value.time}`
    });
};

setInterval(() => {
    dateObject.value = buildDate();
}, 2000);

</script>

<template>
  <div class="center-item">
    <span class="center-text no-select fs-13 cursor-default" @click="onClick">
      <span>{{ dateObject.date }}</span>
      <span style="margin-left: 5px;">{{ dateObject.time }}</span>
    </span>
    <div class="center-block">
      11
    </div>
  </div>
</template>

<style scoped lang="less">


</style>