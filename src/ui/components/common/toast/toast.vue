<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { createToastRef } from './toast';

const {
    toast,
    clearToast,
    onClick,
    onButtonClick,
    onMouseEnter,
    onMouseLeave
} = createToastRef();
</script>

<template>
  <div
    class="os-toast bg-blur"
    :class="{ visible: toast.visible }"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div v-show="toast.from" class="ot-icon">
      <img :src="toast.from?.icon">
    </div>
    <div class="ot-main">
      <div class="font-bold mb-2">{{ toast.title }}</div>
      <div class="fs-13">{{ toast.content }}</div>
      <div class="ot-button text-right" :class="{exist: !!toast.buttonText}">
        <button class="os-button" @click.stop="onButtonClick">
          {{ toast.buttonText }}
        </button>
      </div>
    </div>
    <i class="ei-angle-right ot-arrow" />
    <span class="ot-close bg-blur cursor-default" @click.stop="clearToast">
      <span>×</span>
    </span>
  </div>
</template>

<style scoped lang="less">
  .os-toast {
    display: flex;
    width: 350px;
    padding: 10px;
    align-items: center;
    position: fixed;
    right: 10px;
    top: 46px;
    transform: translateX(110%);
    transition: transform .5s ease-out;
    z-index: 10;
    &.visible{
      transform: translateX(0%);
    }
    &:before{
      border-radius: 12px;
    }
    .ot-icon{
      height: 42px;
      margin: 0 5px;
      margin-right: 13px;
      img{
        height: 100%;
      }
    }
    .ot-main{
      margin-left: 5px;
      flex: 1;

      // .ot-title {
      //   font-weight: bold;
      // }
      // .ot-content{
      //   font-size: 13px;
      // }
      .ot-button {
        display: none;
        &.exist{
          display: block;
          visibility: hidden;
        }
      }
    }
    .ot-arrow {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 15px;
      color: #aaa;
      display: none;
      &:hover{
        color: #fff;
      }
    }
    .ot-close{
      font-size: 14px;
      width: 15px;
      height: 15px;
      position: absolute;
      top: -3px;
      left: -3px;
      display: none;
      align-items: center;
      &:before{
        border-radius: 50%;
      }
    }
    &:hover{
      .ot-button.exist {
        visibility: visible;
      }
      .ot-arrow{
        display: block;
      }
      .ot-close {
        display: flex;
      }
    }
  }
</style>

