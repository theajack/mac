/*
 * @Author: tackchen
 * @Date: 2022-09-04 17:06:26
 * @Description: 扩展坞
 */

import { ref, Ref } from 'vue';

export interface IDockItemProps {
    name: string;
    icon: string;
}

export class DockItem {

    name: Ref<string>;
    icon: Ref<string>;

    constructor ({
        icon,
        name
    }: IDockItemProps) {
        this.name = ref(name);
        this.icon = ref(icon);
    }
}