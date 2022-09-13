/*
 * @Author: tackchen
 * @Date: 2022-09-10 22:08:00
 * @Description: Coding something
 */
import { Disk } from './core/disk/disk';
import { initUI } from './ui';

initUI();

(window as any).disk = new Disk();