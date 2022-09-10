<!--
 * @Author: tackchen
 * @Date: 2022-09-04 08:17:00
 * @Description: Coding something
-->
<script setup lang="ts">
</script>

<template>
  <!-- <img
    alt="Vue logo"
    src="./assets/logo.png"
  >
  <div id="nav">
    <router-link to="/">
      Home
    </router-link> |
    <router-link to="/about">
      About
    </router-link>
  </div> -->
  <router-view />
</template>

<style>
body {
  margin: 0;
}
* {
  box-sizing: border-box;
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
:root{
  --color-white-200: rgba(255, 255, 255, 0.2);
}
</style>
