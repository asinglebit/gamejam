// @ts-nocheck
import { Howl } from 'howler';

/**
 * Run Amok by Kevin MacLeod | https://incompetech.com/
 * Music promoted by https://www.chosic.com/free-music/all/
 * Creative Commons CC BY 3.0
 * https://creativecommons.org/licenses/by/3.0/
 */
import sfxOst from "../../public/resources/sfx/ost.mp3"

import sfxAnvil from "../../public/resources/sfx/anvil.mp3"
import sfxScream from "../../public/resources/sfx/scream.mp3"
import sfxGameOver from "../../public/resources/sfx/game_over.mp3"
import sfxSlash from "../../public/resources/sfx/slash.mp3"
import sfxPunch from "../../public/resources/sfx/punch.mp3"
import sfxZombie1 from "../../public/resources/sfx/zombie_1.mp3"
import sfxZombie2 from "../../public/resources/sfx/zombie_2.mp3"
import sfxZombie3 from "../../public/resources/sfx/zombie_3.mp3"

export const soundOst = new Howl({ src: [sfxOst], loop: true, volume: 0.2});
export const soundAnvil = new Howl({ src: [sfxAnvil], volume: 0.05 });
export const soundScream = new Howl({ src: [sfxScream], volume: 0.05 });
export const soundGameOver = new Howl({ src: [sfxGameOver], volume: 0.2 });
export const soundSlash = new Howl({ src: [sfxSlash], volume: 0.05 });
export const soundPunch = new Howl({ src: [sfxPunch], volume: 0.05 });
export const soundZombie1 = new Howl({ src: [sfxZombie1], volume: 0.05 });
export const soundZombie2 = new Howl({ src: [sfxZombie2], volume: 0.05 });
export const soundZombie3 = new Howl({ src: [sfxZombie3], volume: 0.05 });
