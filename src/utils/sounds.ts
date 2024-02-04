// @ts-nocheck
import { Howl } from 'howler';

/**
 * Run Amok by Kevin MacLeod | https://incompetech.com/
 * Music promoted by https://www.chosic.com/free-music/all/
 * Creative Commons CC BY 3.0
 * https://creativecommons.org/licenses/by/3.0/
 */
import sfxOst from "../assets/audio/ost.mp3"

import sfxAnvil from "../assets/audio/anvil.mp3"
import sfxScream from "../assets/audio/scream.mp3"
import sfxGameOver from "../assets/audio/game_over.mp3"
import sfxSlash from "../assets/audio/slash.mp3"
import sfxPunch from "../assets/audio/punch.mp3"
import sfxZombie1 from "../assets/audio/zombie_1.mp3"
import sfxZombie2 from "../assets/audio/zombie_2.mp3"
import sfxZombie3 from "../assets/audio/zombie_3.mp3"

export const soundOst = new Howl({ src: [sfxOst], loop: true, volume: 0.2});
export const soundAnvil = new Howl({ src: [sfxAnvil], volume: 0.05 });
export const soundScream = new Howl({ src: [sfxScream], volume: 0.05 });
export const soundGameOver = new Howl({ src: [sfxGameOver], volume: 0.2 });
export const soundSlash = new Howl({ src: [sfxSlash], volume: 0.05 });
export const soundPunch = new Howl({ src: [sfxPunch], volume: 0.05 });
export const soundZombie1 = new Howl({ src: [sfxZombie1], volume: 0.05 });
export const soundZombie2 = new Howl({ src: [sfxZombie2], volume: 0.05 });
export const soundZombie3 = new Howl({ src: [sfxZombie3], volume: 0.05 });
