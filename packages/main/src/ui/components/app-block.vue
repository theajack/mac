<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import type { App } from '@/core/apps/app';
import { AppType } from '@/core/apps/app';

defineEmits([ 'click' ]);

const props = withDefaults(defineProps<{
    app: App,
    height?: number,
    dotSize?: 'normal'|'large'
}>(), {
    height: 48,
    dotSize: 'normal',
});

const isNormalDot = props.dotSize === 'normal';

const dotFontSize = isNormalDot ? '12px' : '18px';
const paddingX = isNormalDot ? '4px' : '8px';
const dotRadius = isNormalDot ? '10px' : '20px';

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
      @mousedown.stop
    >
  </div>
</template>

<style lang="less">
.app-block{
    position: relative;
    width: fit-content;
    margin: 0 auto;
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
        font-size: v-bind(dotFontSize);
    }
    .app-msg{
        background-color: rgb(237,57,47);
        font-size: v-bind(dotFontSize);
        line-height: v-bind(dotFontSize);
        min-width: 18px;
        border-radius: v-bind(dotRadius);
        padding: 3px v-bind(paddingX);
        text-align: center;
        right: -5px;
        box-shadow: 1px 1px 1px #2229;
        top: -5px
    }
}
</style>
