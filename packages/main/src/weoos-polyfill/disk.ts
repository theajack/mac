/*
 * @Author: chenzhongsheng
 * @Date: 2025-02-18 21:37:03
 * @Description: Coding something
 */
import { Disk } from '@/weoos-polyfill/temp/os';

export async function useDisk () {
    // ! 单例模式
    const disk = new Disk();
    await disk.ready;
    return disk;
}