/*
 * @Author: tackchen
 * @Date: 2022-09-10 22:08:00
 * @Description: Coding something
 */
import { OS } from './core/os/os';
import { initUI } from './ui';

initUI();

(window as any).os = new OS();