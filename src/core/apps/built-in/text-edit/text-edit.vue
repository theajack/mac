<!--
 * @Author: tackchen
 * @Date: 2022-09-05 19:53:14
 * @Description: Coding something
-->
<script setup lang="ts">
import { ref } from 'vue';
import keyDown from './keydown-event';
function keydown (e: KeyboardEvent) {
    keyDown.call(e.target, e, '    ');
}
const testCode = ref(`function main () {
    console.log("Hello World");
}`);
</script>

<template>
  <div class="flex-center text-white h-full text-edit-w">
    <textarea v-model="testCode" class="text-input w-full h-full" @keydown="keydown" />
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

