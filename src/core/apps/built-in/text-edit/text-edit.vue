<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
function keydown (e: KeyboardEvent) {
    if (e.key === 'Tab') {
        e.preventDefault();
    }
}
</script>

<template>
  <div class="flex-center text-white h-full text-edit-w">
    <textarea class="text-input w-full h-full" @keydown="keydown" />
  </div>
</template>

<style scoped lang="less">
.text-edit-w{
    background-color: #1e1e1e;
    .text-input{
        background-color: transparent;
        padding: 5px 8px;
        border: none;
        outline: none;
        font-family: Menlo, Monaco, "Courier New", monospace;
    }
}
</style>

