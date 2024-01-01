<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { AppType, type App } from '@/core/apps/app';

defineEmits([ 'click' ]);

defineProps<{
    app: App,
    height: number,
}>();
</script>

<template>
  <div class="app-block">
    <span v-show="app.msgCount > 0" class="app-msg">{{ app.msgCount }}</span>
    <i v-if="app.appType===AppType.Link" class="el-link" />
    <i v-else-if="app.appType===AppType.Web" class="ei-chrome" />
    <img
      :src="app.icon"
      :style="{
        'border-radius': app.iconRadius,
        scale: app.iconScale,
        height: height+'px',
        margin: '0 auto',
      }"
      @click="$emit('click')"
    >
  </div>
</template>

<style lang="less">
.app-block{
    position: relative;
    img{
        filter: drop-shadow(1px 1px 1px #2229) drop-shadow(-1px 1px 1px #2229);
    }
    .app-msg, i{
        position: absolute;
        z-index: 1;
    }
    i{
        filter: drop-shadow(1px 1px 1px #222d) drop-shadow(-1px 1px 1px #222d);
        right: -3px;
        bottom: -1px;
        font-size: 12px;
    }
    .app-msg{
        background-color: rgb(237,57,47);
        font-size: 12px;
        line-height: 12px;
        min-width: 18px;
        border-radius: 10px;
        padding: 3px 4px;
        text-align: center;
        right: -5px;
        box-shadow: 1px 1px 1px #2229;
        top: -5px
    }
}
</style>
