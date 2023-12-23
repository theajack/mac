<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { ref } from 'vue';
import { createCalculator } from './cal-core';


const {
    text,
    onChange,
    onCurSign,
    onClearChange,
    input,
} = createCalculator();
const showText = ref(text);
const curSign = ref('');
const isAllClear = ref(true);

onChange((v) => {
    showText.value = v;
});
onCurSign(v => {
    curSign.value = v;
});
onClearChange(v => {
    isAllClear.value = v;
});

const clickCal = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target?.classList.contains('_click')) {
        input(target.innerText.trim());
    }
};
</script>

<template>
  <div class="bg-top cal-w select-none" @click="clickCal">
    <div class="result bg-top text-right" :class="{mini: showText.length >= 10}">{{ showText }}</div>
    <div class="flex bg-center line-top">
      <div class="flex-1 _click">{{ isAllClear?'AC':'C' }}</div>
      <div class="flex-1 _click">+/-</div>
      <div class="flex-1 _click">%</div>
      <div class="flex-1 bg-right _click" :class="{active: curSign === '÷'}">÷</div>
    </div>
    <div class="flex bg-bottom line-top">
      <div class="flex-1 _click">7</div>
      <div class="flex-1 _click">8</div>
      <div class="flex-1 _click">9</div>
      <div class="flex-1 bg-right _click" :class="{active: curSign === '×'}">×</div>
    </div>
    <div class="flex bg-bottom line-top">
      <div class="flex-1 _click">4</div>
      <div class="flex-1 _click">5</div>
      <div class="flex-1 _click">6</div>
      <div class="flex-1 bg-right _click" :class="{active: curSign === '-'}">-</div>
    </div>
    <div class="flex bg-bottom line-top">
      <div class="flex-1 _click">1</div>
      <div class="flex-1 _click">2</div>
      <div class="flex-1 _click">3</div>
      <div class="flex-1 bg-right _click" :class="{active: curSign === '+'}">+</div>
    </div>
    <div class="flex bg-bottom line-top">
      <div class="zero-fix" />
      <div class="w-1/2 _click">0</div>
      <div class="flex-1 _click">.</div>
      <div class="flex-1 bg-right _click">=</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.cal-w > div {
  color: #fff;
  font-size: 20px;
  & > div {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .line-right;
    padding: 8px 0;
    position: relative;
    &:last-child{
      border: none;
    }
    &.active::after{
      content: ' ';
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      border: 1px solid transparent;
      .line-color;
    }
  }

  &.result{
    height: auto;
    padding-right: 10px;
    font-size: 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: end;
    &.mini{
      font-size: 21px;
    }
  }
}
.bg-top {
  background-color: #372956;
}
.bg-center {
  background-color: #4b3e67;
  div{
    &:active {
      background-color: #655a77;
    }
  }
}
.bg-bottom {
  background-color: #655a77;
  div{
    &:active {
      background-color: #a29cae;
    }
  }
}
.bg-right {
  background-color: #ff9f0a;
  &:active {
    background-color: #cb7d06;
  }
}
.line-color {
  border-color: #382956;
}
.line-top {
  border-top: 1px solid white;
  .line-color
}
.line-right {
  border-right: 1px solid white;
  .line-color
}
.zero-fix{
  width: 0.5px;
  border: none!important;
}
</style>

