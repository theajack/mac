/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-26 10:24:56
 * @Description: Coding something
 */
import { ref } from 'vue';

export function createDragScope ({
    dragClass,
    ondragfinish,
    dataKey = 'id',
}: {
    dragClass: string,
    ondragfinish: (src: number, id: number|'self')=>void
    dataKey?: string,
}) {

    const dragActiveId = ref(-1);

    let startId = -1;

    const getTargetId = (e: any) => {
        const count = 0; // 限制一下最大搜索层级
        let el = e.target;
        while (!el.classList.contains(dragClass) && count < 5) {
            el = el.parentElement;
        }
        return el.classList.contains(dragClass) ? parseInt(el.dataset?.[dataKey]) : -1;
    };

    const finish = (targetId: number) => {
        ondragfinish(startId, targetId);
        startId = -1;
        dragActiveId.value = -1;
    };

    return {
        dragActiveId,
        dragstart (e: any) {
            startId = getTargetId(e);
            dragActiveId.value = startId;
        },
        dragenter (e: any) {
            // 处理进入自己的情况
            const targetId = getTargetId(e);
            dragActiveId.value = targetId;
        },
        dragend () {
            // console.log('dragend', e.target);
            if (startId >= 0) {
                finish(-1);
            }
        },
        drop (e: any) {
            // console.log('dropppppp', e.target, e);
            const targetId = getTargetId(e);
            finish(targetId);
        }
    };
}