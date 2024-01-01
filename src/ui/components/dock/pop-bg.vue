<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { degToArc } from '@/lib/utils';
const props = withDefaults(defineProps<{
    angleWidth?: number,
    backgroundColor?: string,
    left?: string,
}>(), {
    angleWidth: 20,
    backgroundColor: '#2229',
    left: '50%',
});

const width = `${props.angleWidth / 2}px`;
const oy = `${props.angleWidth / 2 - 4}px`;
// 旋转方块的角度
const bwidth = `${props.angleWidth * Math.cos(degToArc(45))}px`;

</script>

<template>
  <div class="pop-w">
    <div class="pop-border" />
    <div class="pop-angle" />
  </div>
</template>

<style scoped lang="less">

  // todo 此部分为实现毛玻璃带尖角的气泡 有待优化
  .common-bg{
      backdrop-filter: blur(40px);
      border: 1px solid var(--color-white-200);
      box-shadow: var(--box-shadow-border);
      background-color: v-bind(backgroundColor);
  }
  .pop-w::before{
      content: ' ';
      backdrop-filter: blur(40px);
  }
  .pop-w{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    --width: v-bind(width);
    --left: v-bind(left);
    --bwidth: v-bind(bwidth);
    .pop-border{
      .common-bg;
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      left: 0;
      top:0;
      border-radius: 6px;
      clip-path: polygon(
        -10px -10px,
        calc(100% + 10px) -10px,
        calc(100% + 10px) calc(100% + 10px),

        calc(var(--left) + var(--width)) calc(100% + 10px),
        calc(var(--left) + var(--width)) calc(100% - 1px),
        calc(var(--left) - var(--width)) calc(100% - 1px),
        calc(var(--left) - var(--width)) calc(100% + 10px),

        -10px calc(100% + 10px)
      );
    }
    .pop-angle{
      .common-bg;
      background-color: v-bind(backgroundColor);
      width: var(--bwidth);
      height: var(--bwidth);
      position: absolute;
      left: var(--left);
      bottom: 0.5px;
      transform-origin: center center;
      // transform: rotate(45deg) translate(-50%, -100%);
      transform: translate(-50%, v-bind(oy)) rotate(45deg);
      border-radius: 0 0 3px 0;
      clip-path: polygon(
        100% 0,
        calc(100% + 10px) 0,
        calc(100% + 10px) calc(100% + 10px),
        0 calc(100% + 10px),
        0 100%,
      );
    }
  }

</style>
