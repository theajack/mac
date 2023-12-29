<!--
 * @Author: chenzhongsheng
 * @Date: 2023-12-22 23:06:54
 * @Description: Coding something
-->
<script lang='ts' setup>
import { fetchProcess, resource } from '@/lib/utils';
import { onMounted, ref } from 'vue';

// const url = 'https://cdn.jsdelivr.net/gh/theajack/mac@gh-pages/assets/desktop-bg.jpg';

const url = resource('desktop-bg.jpg');

const process = ref(0);

onMounted(() => {
    fetchProcess(url, v => {
        process.value = v;
    });
});
</script>
<template>
  <div v-show="process < 100" class="loading-mask flex-center fixed w-full h-full top-0 left-0 bg-black">
    <div>
      <div><i :style="{opacity: 0.3 + (0.7*process/100)}" class="ei-apple" /></div>
      <div class="loading-bar">
        <div :style="{width: `${process}%`}" class="bg-white" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.loading-mask {
    position: fixed;
    height: 100%;
    z-index: 1000;
    background-color: #111;
    text-align: center;
    .ei-apple{
        font-size: 60px;
    }
    .loading-bar{
        height: 5px;
        border-radius: 5px;
        margin-top: 30px;
        width: 200px;
        background-color: #444;
        div{
            height: 100%;
            border-radius: 5px;
        }
    }
}
</style>
