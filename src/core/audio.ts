/*
 * @Author: tackchen
 * @Date: 2022-10-07 11:46:24
 * @Description: Coding something
 */

import { resource } from '@/lib/utils';

const AudioKeys = [ 'toast' ] as const;

type TAudioKey = (typeof AudioKeys)[number]

const Audios: {
    [prop in TAudioKey]: HTMLAudioElement | {
        play(): void;
        stop(): void;
    }
} = {} as any;

function play (name: TAudioKey) {
    if (Audios[name]) {
        Audios[name].play();
    }
}

function buildSrc (name: string) {
    return resource(`audio/${name}.mp3`);
}

export function initAudioPlayer () {
    const AudioContext = window.AudioContext ||
        (window as any).webkitAudioContext ||
        (window as any).mozAudioContext ||
        (window as any).msAudioContext;

    AudioKeys.forEach((key) => {
        if (AudioContext) {
            Audios[key] = initAudioContext(key, AudioContext);
        } else {
            Audios[key] = initAudio(key);
        }
    });
}

function initAudio (key: TAudioKey) {
    const audio = document.createElement('audio');
    audio.autoplay = false;
    audio.src = buildSrc(key);
    return audio;
}

function initAudioContext (name: TAudioKey, AudioContext: any) {
    const context = new AudioContext() as AudioContext;

    let source: AudioBufferSourceNode | null = null;
    let audioBuffer: AudioBuffer;

    function stopSound () {
        if (source) {
            source.stop(0); // 立即停止
        }
    }

    function playSound () {
        source = context.createBufferSource();
        source.buffer = audioBuffer;
        // source.loop = true; //循环播放
        source.connect(context.destination);
        source.start(0); // 立即播放
    }

    function initSound (arrayBuffer: ArrayBuffer) {
        context.decodeAudioData(arrayBuffer, (buffer: AudioBuffer) => { // 解码成功时的回调函数
            audioBuffer = buffer;
        }, (e: Error) => { // 解码出错时的回调函数
            console.log('Error decoding file', e);
        });
    }

    function loadAudioFile (url: string) {
        const xhr = new XMLHttpRequest(); // 通过XHR下载音频文件
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () { // 下载完成
            initSound(this.response);
        };
        xhr.send();
    }
    loadAudioFile(buildSrc(name));
    return {
        play () {
            playSound();
        },
        stop () {
            stopSound();
        },
    };
}

export const AudioPlayer = {
    toast () {
        play('toast');
    }
};
