/*
 * @Author: tackchen
 * @Date: 2021-11-18 12:13:05
 * @LastEditors: tackchen
 * @FilePath: \mac\src\lib\use-state.js
 * @Description: Coding something
 */
import { useStore, mapState } from 'vuex';
import { computed } from 'vue';
/**
 * 封装一个拿到指定属性的函数，返回值是计算属性的对象
 *
 * @export
 * @param {*} mapper 对象或者数组 {} || [] 两种写法都支持
 * @return {*} 返回值就是封装好的对象，对象的属性是计算属性对象
 */
export default function (mapper) {
    // 拿到 $store 对象
    const $store = useStore();
    // 获取到对应的对象的所有函数
    /*
  functions:{
    name:function(){},
    age:function(){},
    ...
  }
  */
    const storeStateFns = mapState(mapper);
    // 对数据进行转换
    const storeState = {};
    Object.keys(storeStateFns).forEach(fnKey => {
    // 绑定我们的对象，并在函数上赋值我们的 $store属性
    // 返回的函数就是一个能拿到 $store 属性的函数了
        const fn = storeStateFns[fnKey].bind({ $store });
        // 属性转为计算属性，并保存到返回的对象上
        storeState[fnKey] = computed(fn);
    });
    return storeState;
}