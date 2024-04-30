/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-13 08:41:54
 * @Description: Coding something
 */
import hex_md5 from './md5';
export * from './application';
export { getModuleMap } from './module';

export const md5 = hex_md5;

export { babel } from './babel';

export { execModule } from './exec';

// /*
//  * @Author: chenzhongsheng
//  * @Date: 2023-01-13 08:41:54
//  * @Description: Coding something
//  */
// import { Application } from './application';
// //   import {div} from 'alins';
// //   import * as Loadsh from 'loadsh';
// //   console.log(div);
// //   div('1111').mount(document.body);
// //   export default {div, Loadsh};


// // import {div} from 'alins';
// // const div = {};
// // const Loadsh = {};
// // console.log(div, Loadsh);
// // div('1111').mount(document.body);
// // export default {div, Loadsh};
// // import * as Loadsh from 'loadsh';
// // console.log(Loadsh);
// // const arr = [1,2,3]
// // console.log(Loadsh.fill(arr, 1))
// // console.log(arr)

// // 'use strict';

// // var _vue = require('vue');
// // console.log(_vue);

// // var _vue2 = _interopRequireDefault(_vue);
// // console.log(_vue2, _vue2.__esModule);

// // function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// // console.log('vuevue', _vue2.default);


// /*
// import vue, {BaseTransition} from 'vue';
// console.log('vuevue', vue, BaseTransition);
// */

// // import * as Loadsh from 'loadsh';
// // console.log(Loadsh);
// // const arr = [1,2,3]
// // console.log(Loadsh.fill(arr, 1))
// // console.log(arr)

// (window as any).app = new Application({
//     code: `
// import * as Loadsh from 'loadsh';
// console.log(Loadsh);
// const arr = [1,2,3]
// console.log(Loadsh.fill(arr, 1))
// console.log(arr)
//     `,
//     onLoaded: (entry) => {
//         console.log(entry);
//         (window as any).entry = entry;
//     },
//     iifeNameMap: {
//         'alins': 'Alins',
//         'vue': 'Vue',
//     },
//     onDependenciesParsed (graph) {
//         console.log('【graph】：', graph);
//     },
//     onProgress (progress) {
//         console.log('【onProgress】：', progress);
//     }
// });

// // export function safeLeftMove (value: number, n: number) {
// //     const max = 1 << (32 - n);
// //     if (value < max)
// //         return value << n;
// //     return (value & (max - 1)) << n;
// // }
// // const N_31_1 = 2 ** 31 - 1;
// // function completeCode (value: number) {
// //     if (value > 0) return value.toString(2);
// //     return '1' + ((-value ^ N_31_1) + 1).toString(2);
// // }

// // (window as any).safeLeftMove = safeLeftMove;
// // (window as any).completeCode = completeCode;