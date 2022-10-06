<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:14:50
 * @Description: Coding something
-->

<script setup lang="ts">
import { getAppManager } from '@/core/context';
import { ref } from 'vue';
import Select from '@/ui/components/common/select/index.vue';
import { createMenuStatus } from './menu';

const manager = ref(getAppManager());
(window as any).manager = manager;
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
      @mouseenter="onMouseEnter"
    >
      <i
        class="ei-apple"
        @click="() => {onClickTitle({item: manager.mainStatus, index: -1})}"
      />
      <!-- <div class="menu-select">
        <Select :list="manager.currentApp.status.main.children" />
      </div> -->
    </div>

    <div
      v-for="item,index in manager.currentApp.status.list"
      :key="item.title"
      class="menu-bar-item"
      :class="{'active': index === activeIndex}"
      @mouseenter="onMouseEnter"
    >
      <span
        class="menu-title"
        :class="{
          'menu-main': index === 0,
        }"
        @click="() => {onClickTitle({item: item.children, index})}"
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
        .menu-bar-item{
            padding: 0 12px;
            font-size: 14px;
            display: flex;
            align-items: center;
            cursor: default;
            height: 25px;
            border-radius: 4px;
            &.active{
                background-color: #fff3;
            }
            .menu-select{
                display: none;
                position: absolute;
            }
            .menu-title{
                &.menu-main{
                    font-weight: bold;
                }
            }

            &:first-child{
                font-size: 16px;
                padding: 0 15px;
                padding-right: 7px;
            }
        }
    }
  </style>