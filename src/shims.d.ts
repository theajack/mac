/*
 * @Author: tackchen
 * @Date: 2022-09-04 08:04:01
 * @Description: Coding something
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module 'filer' {
  export const fs: any;
}
declare module 'filer.js' {
  export class Filer {}

  export default Filer;
}