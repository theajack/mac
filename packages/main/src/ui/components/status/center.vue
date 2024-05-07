<!--
 * @Author: tackchen
 * @Date: 2022-10-05 17:04:40
 * @Description: Coding something
-->

<script setup lang="ts">
import Battery from './default-center/battery.vue';
import Wifi from './default-center/wifi.vue';
import Search from './default-center/search.vue';
import Info from './default-center/info.vue';
import Siri from './default-center/siri.vue';
import Date from './default-center/date.vue';
</script>

<template>
  <div class="center-bar">
    <Battery />
    <Wifi />
    <Search />
    <Info />
    <Siri />
    <Date />
  </div>
</template>

<style lang="less">
  .center-bar {
    display: flex;
    position: absolute!important;
    right: 0;
    height: 100%;
    top: 0;
    align-items: center;
    margin-right: 7px;

    .center-item{
      display: flex;
      align-items: center;
      margin: 0 7px;
      .center-icon{
        height: 18px;
      }
      .center-text{

      }
    }
    .center-block{
        display: none;
    }
  }
</style>