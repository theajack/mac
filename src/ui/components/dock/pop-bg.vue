<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->

<template>
  <div class="dock-title-bg">
    <div class="dock-title-bg-bg" />
    <div class="dock-title-bg-left">
      <div />
    </div>
    <div class="dock-title-bg-center">
      <div />
    </div>
    <div class="dock-title-bg-angle" />
    <div class="dock-title-bg-right">
      <div />
    </div>
  </div>
</template>

<style scoped lang="less">

  // todo 此部分为实现毛玻璃带尖角的气泡 有待优化
  .common-bg{
      backdrop-filter: blur(40px);
      border: 1px solid var(--color-white-200);
      box-shadow: var(--box-shadow-border);
      background-color: #2229;
      padding: 4px;
  }

  .dock-title-bg{
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
    .dock-title-bg-bg{
      position: absolute;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(40px);
      background-color: #2229;
      border-radius: 10px;
    }
    .dock-title-bg-left{
      flex: 1;
      overflow: hidden;
      padding: 1px;
      div{
        .common-bg;
        border-radius: 5px 0 0 5px;
        position: relative;
        height: 100%;
        width: 120%;
        background-color: transparent;
        backdrop-filter: none;
      }
    }
    .dock-title-bg-center{
      width: 13px;
      overflow: hidden;
      padding: 1px;
      div{
        .common-bg;
        border-radius: 0;
        left: -2px;
        position: relative;
        width: 150%;
        height: 110%;
        background-color: transparent;
        backdrop-filter: none;
      }
    }
    .dock-title-bg-right{
      flex: 1;
      overflow: hidden;
      padding: 1px;
      position: relative;
      transform: rotate(180deg);
      div{
        .common-bg;
        border-radius: 5px 0 0 5px;
        height: 100%;
        width: 120%;
        right: 1px;
        background-color: transparent;
        backdrop-filter: none;
      }
    }
    .dock-title-bg-angle{
      display: inline-block;
      position: absolute;
      left: 50%;
      bottom: -8px;
      width: 20px;
      height: 9px;
      transform: translateX(-50%);
      overflow: hidden;
      &:after {
        .common-bg;
        content: " ";
        transform: rotate(45deg) translateX(-50%);
        border-radius: 2px;
        display: inline-block;
        position: absolute;
        top: -3px;
        left: 43%;
        padding: 5px;
      }
    }
  }
</style>
