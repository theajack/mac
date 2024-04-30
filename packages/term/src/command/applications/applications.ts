/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-30 22:11:34
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-12 23:29:20
 */

import { RunCommand } from './run';
import { BaiduCommand } from './baidu';
import { GoogleCommand } from './google';
import { OpenCommand } from './open';
import { InstallCommand } from './install';
import { BookmarkCommand } from './bookmark';
import { MusicCommand } from './music';
import { CodeCommand } from './code';
export function getApplications () {
    return [
        RunCommand,
        BaiduCommand,
        GoogleCommand,
        BookmarkCommand,
        OpenCommand,
        InstallCommand,
        MusicCommand,
        CodeCommand,
    ];
}