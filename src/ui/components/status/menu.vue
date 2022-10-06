<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:14:50
 * @Description: Coding something
-->

<script setup lang="ts">
import { getAppManager } from '@/core/context';
import Select from '@/ui/components/common/select/index.vue';
import { createMenuStatus } from './menu';

const { list } = getAppManager().currentApp.status;

const { mainStatus } = getAppManager();

const {
    activeIndex,
    onClickTitle,
    onMouseEnter,
} = createMenuStatus();

</script>

<template>
  <div class="menu-bar">
    <div
      class="menu-bar-item"
      :class="{'active': -1 === activeIndex}"
      @mouseenter="onMouseEnter(-1)"
    >
      <i
        class="ei-apple"
        @click="onClickTitle(-1)"
      />
      <div class="menu-select">
        <Select :list="mainStatus" />
      </div>
    </div>

    <div
      v-for="item,index in list"
      :key="item.title"
      class="menu-bar-item"
      :class="{'active': index === activeIndex}"
      @mouseenter="onMouseEnter(index)"
    >
      <span
        class="menu-title"
        :class="{
          'menu-main': index === 0,
        }"
        @click="onClickTitle(index)"
      >{{ item.title }}</span>
      <div class="menu-select">
        <Select :list="item.children" />
      </div>
    </div>
  </div>
</template>


<style scoped lang="less">
    .menu-bar{
        display: flex;
        align-items: center;
        padding-left: 5px;
        .menu-bar-item{
            padding: 0 10px;
            font-size: 13px;
            display: flex;
            align-items: center;
            cursor: default;
            height: 25px;
            border-radius: 4px;
            position: relative;
            .menu-select{
                display: none;
                position: absolute;
                left: 0;
                top: 100%;
                margin-top: 8px;
                font-size: 14px;
            }
            &.active{
                background-color: #fff3;
                .menu-select{
                    display: block;
                }
            }
            .menu-title{
                &.menu-main{
                    font-weight: bold;
                }
            }

            &:first-child{
                font-size: 16px;
                padding: 0 10px;
            }
        }
    }
  </style>