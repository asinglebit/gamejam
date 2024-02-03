import * as PIXI from "pixi.js"
import { CompositeTilemap } from '@pixi/tilemap';

import { ANIMATION_SPEED, CELL_SIZE } from "../constants"
import { TimedAnimatedSprite } from "../core/timed_animated_sprite"

export let spriteSheet: PIXI.Spritesheet
export let spriteSheetGrass: PIXI.Spritesheet
export let spriteSheetRanged: PIXI.Spritesheet
export let spriteSheetMelee: PIXI.Spritesheet
export let spriteSheetProducer: PIXI.Spritesheet
export let spriteSheetUndead: PIXI.Spritesheet
export let spriteSheetProps: PIXI.Spritesheet
export let spriteSheetUI: PIXI.Spritesheet

// Load spritesheet
export const loadSprites = async () => {
  PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST
  spriteSheet = await PIXI.Assets.load("/resources/main.json")
  spriteSheetGrass = await PIXI.Assets.load("/resources/grass/grass.json")
  spriteSheetRanged = await PIXI.Assets.load("/resources/characters/ranged.json")
  spriteSheetMelee = await PIXI.Assets.load("/resources/characters/warrior.json")
  spriteSheetProducer = await PIXI.Assets.load("/resources/characters/blacksmith.json")
  spriteSheetUndead = await PIXI.Assets.load("/resources/characters/undead.json")
  spriteSheetProps = await PIXI.Assets.load("/resources/props/props.json")
  spriteSheetUI = await PIXI.Assets.load("/resources/ui/ui.json")
}

export const createTileMap = () => {
  const tilemap = new CompositeTilemap()
  for (let row_index = 0; row_index < 40; ++row_index) {
    for (let column_index = 0; column_index < 40; ++column_index) {
      const variation = Math.floor(Math.random() * 4) + 1
      tilemap.tile(`grass_tile_${variation}.png`, column_index * CELL_SIZE, row_index * CELL_SIZE)
    }
  }  
  return tilemap
}

export const createSpriteTree = () => {
  const variation = Math.random() > 0.5 ? 1 : 2
  const sprite = new PIXI.AnimatedSprite([
    spriteSheetProps.textures[`Animated Tree${variation}_frame1.png`],
    spriteSheetProps.textures[`Animated Tree${variation}_frame2.png`],
    spriteSheetProps.textures[`Animated Tree${variation}_frame3.png`],
    spriteSheetProps.textures[`Animated Tree${variation}_frame4.png`],
    spriteSheetProps.textures[`Animated Tree${variation}_frame5.png`],
    spriteSheetProps.textures[`Animated Tree${variation}_frame6.png`],
    spriteSheetProps.textures[`Animated Tree${variation}_frame7.png`],
    spriteSheetProps.textures[`Animated Tree${variation}_frame8.png`],
  ])
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.anchor.x = 0.47
  sprite.anchor.y = 0.62
  sprite.play()
  return sprite
}

export const createSpriteShadow = () => {
  const sprite = new PIXI.Sprite(spriteSheetProps.textures["char-shadow.png"])
  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5
  return sprite
}

export const createRandomProp = () => {
  const props = [
    `flowers_1.png`,
    `flowers_2.png`,
    `flowers_3.png`,
    `flowers_4.png`,
    `flowers_5.png`,
    `flowers_6.png`,
    `flowers_7.png`,
    `flowers_8.png`,
    `flowers_9.png`,
    `flowers_10.png`,
    `flowers_11.png`,
    `flowers_12.png`,
    `flowers_13.png`,
    `flowers_14.png`,
    `flowers_15.png`,
    `flowers_16.png`,
    `flowers_17.png`,
    `flowers_18.png`,
    `flowers_19.png`,
    `grass as sprites - lighter_1.png`,
    `grass as sprites - lighter_2.png`,
    `grass as sprites - lighter_3.png`,
    `grass as sprites - lighter_4.png`,
    `grass as sprites - lighter_5.png`,
    `grass as sprites - lighter_6.png`,
    `grass as sprites - lighter_7.png`,
    `grass as sprites - lighter_8.png`,
    `grass as sprites - lighter_9.png`,
    `grass as sprites - lighter_10.png`,
    `grass as sprites - lighter_11.png`,
    `grass as sprites - lighter_12.png`,
    `grass as sprites - lighter_13.png`,
    `grass as sprites - lighter_14.png`,
    `grass as sprites - lighter_15.png`,
    `grass as sprites - lighter_16.png`,
    `grass as sprites - lighter_17.png`,
    `grass as sprites - lighter_18.png`,
    `grass as sprites - lighter_19.png`,
    `grass as sprites - lighter_20.png`,
    `rocks-color scheme2-grass_1.png`,
    `rocks-color scheme2-grass_2.png`,
    `rocks-color scheme2-grass_3.png`,
    `rocks-color scheme2-grass_4.png`,
    `rocks-color scheme2-grass_5.png`,
    `rocks-color scheme2-grass_6.png`,
    `rocks-color scheme2-grass_7.png`,
    `rocks-color scheme2-grass_8.png`,
    `rocks-color scheme2-grass_9.png`,
  ]
  const variation = Math.floor(Math.random() * props.length)
  const sprite = new PIXI.Sprite(spriteSheetProps.textures[props[variation]])
  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5
  return sprite
}

export const createSpriteRanged = () => {
  const sprite = new TimedAnimatedSprite({
    attack: [
      spriteSheetRanged.textures["ranged-attack-1.png"],
      spriteSheetRanged.textures["ranged-attack-2.png"],
      spriteSheetRanged.textures["ranged-attack-3.png"],
      spriteSheetRanged.textures["ranged-attack-4.png"],
      spriteSheetRanged.textures["ranged-attack-5.png"],
      spriteSheetRanged.textures["ranged-attack-6.png"],
      spriteSheetRanged.textures["ranged-attack-7.png"],
      spriteSheetRanged.textures["ranged-attack-8.png"],
      spriteSheetRanged.textures["ranged-attack-9.png"],
      spriteSheetRanged.textures["ranged-attack-10.png"],
      spriteSheetRanged.textures["ranged-attack-11.png"],
      spriteSheetRanged.textures["ranged-attack-12.png"],
      spriteSheetRanged.textures["ranged-attack-13.png"],
      spriteSheetRanged.textures["ranged-attack-14.png"],
    ],
    idle: [
      spriteSheetRanged.textures["ranged-idle-1.png"],
      spriteSheetRanged.textures["ranged-idle-2.png"],
      spriteSheetRanged.textures["ranged-idle-3.png"],
      spriteSheetRanged.textures["ranged-idle-4.png"],
      spriteSheetRanged.textures["ranged-idle-5.png"],
      spriteSheetRanged.textures["ranged-idle-6.png"],
      spriteSheetRanged.textures["ranged-idle-7.png"],
      spriteSheetRanged.textures["ranged-idle-8.png"],
    ],
    death: [
      spriteSheetRanged.textures["ranged-death-1.png"],
      spriteSheetRanged.textures["ranged-death-2.png"],
      spriteSheetRanged.textures["ranged-death-3.png"],
      spriteSheetRanged.textures["ranged-death-4.png"],
      spriteSheetRanged.textures["ranged-death-5.png"],
      spriteSheetRanged.textures["ranged-death-6.png"],
      spriteSheetRanged.textures["ranged-death-7.png"],
      spriteSheetRanged.textures["ranged-death-8.png"],
      spriteSheetRanged.textures["ranged-death-9.png"],
      spriteSheetRanged.textures["ranged-death-10.png"],
    ],
    hurt: [
      spriteSheetRanged.textures["ranged-hurt-1.png"],
      spriteSheetRanged.textures["ranged-hurt-2.png"],
      spriteSheetRanged.textures["ranged-hurt-3.png"],
      spriteSheetRanged.textures["ranged-hurt-4.png"],
      spriteSheetRanged.textures["ranged-hurt-5.png"],
      spriteSheetRanged.textures["ranged-hurt-6.png"],
      spriteSheetRanged.textures["ranged-hurt-7.png"],
      spriteSheetRanged.textures["ranged-hurt-8.png"],
    ],
  }, "idle")
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.anchor.x = 0.42
  sprite.anchor.y = 0.59
  return sprite
}

export const createSpriteMelee = () => {
  const sprite = new TimedAnimatedSprite({
    attack1: [
      spriteSheetMelee.textures["warrior-attack-1-1.png"],
      spriteSheetMelee.textures["warrior-attack-1-2.png"],
      spriteSheetMelee.textures["warrior-attack-1-3.png"],
      spriteSheetMelee.textures["warrior-attack-1-4.png"],
      spriteSheetMelee.textures["warrior-attack-1-5.png"],
      spriteSheetMelee.textures["warrior-attack-1-6.png"],
      spriteSheetMelee.textures["warrior-attack-1-7.png"],
      spriteSheetMelee.textures["warrior-attack-1-8.png"],
      spriteSheetMelee.textures["warrior-attack-1-9.png"],
      spriteSheetMelee.textures["warrior-attack-1-10.png"],
      spriteSheetMelee.textures["warrior-attack-1-11.png"],
      spriteSheetMelee.textures["warrior-attack-1-12.png"],
      spriteSheetMelee.textures["warrior-attack-1-13.png"],
      spriteSheetMelee.textures["warrior-attack-1-14.png"],
      spriteSheetMelee.textures["warrior-attack-1-15.png"],
      spriteSheetMelee.textures["warrior-attack-1-16.png"],
    ],
    attack2: [
      spriteSheetMelee.textures["warrior-attack-2-1.png"],
      spriteSheetMelee.textures["warrior-attack-2-2.png"],
      spriteSheetMelee.textures["warrior-attack-2-3.png"],
      spriteSheetMelee.textures["warrior-attack-2-4.png"],
      spriteSheetMelee.textures["warrior-attack-2-5.png"],
      spriteSheetMelee.textures["warrior-attack-2-6.png"],
      spriteSheetMelee.textures["warrior-attack-2-7.png"],
      spriteSheetMelee.textures["warrior-attack-2-8.png"],
      spriteSheetMelee.textures["warrior-attack-2-9.png"],
      spriteSheetMelee.textures["warrior-attack-2-10.png"],
      spriteSheetMelee.textures["warrior-attack-2-11.png"],
    ],
    death: [
      spriteSheetMelee.textures["warrior-death-1.png"],
      spriteSheetMelee.textures["warrior-death-2.png"],
      spriteSheetMelee.textures["warrior-death-3.png"],
      spriteSheetMelee.textures["warrior-death-4.png"],
      spriteSheetMelee.textures["warrior-death-5.png"],
      spriteSheetMelee.textures["warrior-death-6.png"],
      spriteSheetMelee.textures["warrior-death-7.png"],
      spriteSheetMelee.textures["warrior-death-8.png"],
      spriteSheetMelee.textures["warrior-death-9.png"],
      spriteSheetMelee.textures["warrior-death-10.png"],
      spriteSheetMelee.textures["warrior-death-11.png"],
      spriteSheetMelee.textures["warrior-death-12.png"],
      spriteSheetMelee.textures["warrior-death-13.png"],
      spriteSheetMelee.textures["warrior-death-14.png"],
      spriteSheetMelee.textures["warrior-death-15.png"],
      spriteSheetMelee.textures["warrior-death-16.png"],
      spriteSheetMelee.textures["warrior-death-17.png"],
      spriteSheetMelee.textures["warrior-death-18.png"],
      spriteSheetMelee.textures["warrior-death-19.png"],
    ],
    hurt: [
      spriteSheetMelee.textures["warrior-hurt-1.png"],
      spriteSheetMelee.textures["warrior-hurt-2.png"],
      spriteSheetMelee.textures["warrior-hurt-3.png"],
      spriteSheetMelee.textures["warrior-hurt-4.png"],
      spriteSheetMelee.textures["warrior-hurt-5.png"],
      spriteSheetMelee.textures["warrior-hurt-6.png"],
      spriteSheetMelee.textures["warrior-hurt-7.png"],
      spriteSheetMelee.textures["warrior-hurt-8.png"],
    ],
    idle: [
      spriteSheetMelee.textures["warrior-idle-1.png"],
      spriteSheetMelee.textures["warrior-idle-2.png"],
      spriteSheetMelee.textures["warrior-idle-3.png"],
      spriteSheetMelee.textures["warrior-idle-4.png"],
      spriteSheetMelee.textures["warrior-idle-5.png"],
      spriteSheetMelee.textures["warrior-idle-6.png"],
      spriteSheetMelee.textures["warrior-idle-7.png"],
      spriteSheetMelee.textures["warrior-idle-8.png"],
      spriteSheetMelee.textures["warrior-idle-9.png"],
      spriteSheetMelee.textures["warrior-idle-10.png"],
      spriteSheetMelee.textures["warrior-idle-11.png"],
      spriteSheetMelee.textures["warrior-idle-12.png"],
      spriteSheetMelee.textures["warrior-idle-13.png"],
      spriteSheetMelee.textures["warrior-idle-14.png"],
      spriteSheetMelee.textures["warrior-idle-15.png"],
      spriteSheetMelee.textures["warrior-idle-16.png"],
    ],
  }, "idle")
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.anchor.x = 0.47
  sprite.anchor.y = 0.62
  return sprite
}

export const createSpriteProducer = () => {
  const sprite = new TimedAnimatedSprite({
    idle: [
      spriteSheetProducer.textures["blacksmith-idle-1.png"],
      spriteSheetProducer.textures["blacksmith-idle-2.png"],
      spriteSheetProducer.textures["blacksmith-idle-3.png"],
      spriteSheetProducer.textures["blacksmith-idle-4.png"],
      spriteSheetProducer.textures["blacksmith-idle-5.png"],
      spriteSheetProducer.textures["blacksmith-idle-6.png"],
    ],
    produce: [
      spriteSheetProducer.textures["blacksmith-transition-5.png"],
      spriteSheetProducer.textures["blacksmith-transition-4.png"],
      spriteSheetProducer.textures["blacksmith-transition-3.png"],
      spriteSheetProducer.textures["blacksmith-transition-2.png"],
      spriteSheetProducer.textures["blacksmith-transition-1.png"],
      spriteSheetProducer.textures["blacksmith-produce-1.png"],
      spriteSheetProducer.textures["blacksmith-produce-2.png"],
      spriteSheetProducer.textures["blacksmith-produce-3.png"],
      spriteSheetProducer.textures["blacksmith-produce-4.png"],
      spriteSheetProducer.textures["blacksmith-produce-5.png"],
      spriteSheetProducer.textures["blacksmith-produce-6.png"],
      spriteSheetProducer.textures["blacksmith-produce-7.png"],
      spriteSheetProducer.textures["blacksmith-produce-8.png"],
      spriteSheetProducer.textures["blacksmith-produce-9.png"],
      spriteSheetProducer.textures["blacksmith-produce-10.png"],
      spriteSheetProducer.textures["blacksmith-produce-11.png"],
      spriteSheetProducer.textures["blacksmith-produce-12.png"],
      spriteSheetProducer.textures["blacksmith-produce-13.png"],
      spriteSheetProducer.textures["blacksmith-transition-1.png"],
      spriteSheetProducer.textures["blacksmith-transition-2.png"],
      spriteSheetProducer.textures["blacksmith-transition-3.png"],
      spriteSheetProducer.textures["blacksmith-transition-4.png"],
      spriteSheetProducer.textures["blacksmith-transition-5.png"],
    ],
  }, "idle")
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.anchor.x = 0.47
  sprite.anchor.y = 0.62
  return sprite
}

export const createSpriteAnvil = () => {
  const sprite = new PIXI.AnimatedSprite([
    spriteSheetProducer.textures["blacksmith-anvil-1.png"],
    spriteSheetProducer.textures["blacksmith-anvil-2.png"],
    spriteSheetProducer.textures["blacksmith-anvil-3.png"],
    spriteSheetProducer.textures["blacksmith-anvil-4.png"],
    spriteSheetProducer.textures["blacksmith-anvil-5.png"],
    spriteSheetProducer.textures["blacksmith-anvil-6.png"],
  ])
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.anchor.x = 0.47
  sprite.anchor.y = 0.62
  return sprite
}

export const createSpriteUndead = () => {
  const sprite = new TimedAnimatedSprite({
    attack: [
      spriteSheetUndead.textures["undead-attack-1.png"],
      spriteSheetUndead.textures["undead-attack-2.png"],
      spriteSheetUndead.textures["undead-attack-3.png"],
      spriteSheetUndead.textures["undead-attack-4.png"],
      spriteSheetUndead.textures["undead-attack-5.png"],
      spriteSheetUndead.textures["undead-attack-6.png"],
      spriteSheetUndead.textures["undead-attack-7.png"],
      spriteSheetUndead.textures["undead-attack-8.png"],
      spriteSheetUndead.textures["undead-attack-9.png"],
      spriteSheetUndead.textures["undead-attack-10.png"],
      spriteSheetUndead.textures["undead-attack-11.png"],
      spriteSheetUndead.textures["undead-attack-12.png"],
      spriteSheetUndead.textures["undead-attack-13.png"],
      spriteSheetUndead.textures["undead-attack-14.png"],
      spriteSheetUndead.textures["undead-attack-15.png"],
      spriteSheetUndead.textures["undead-attack-16.png"],
      spriteSheetUndead.textures["undead-attack-17.png"],
      spriteSheetUndead.textures["undead-attack-18.png"],
    ],
    walk: [
      spriteSheetUndead.textures["undead-walk-1.png"],
      spriteSheetUndead.textures["undead-walk-2.png"],
      spriteSheetUndead.textures["undead-walk-3.png"],
      spriteSheetUndead.textures["undead-walk-4.png"],
      spriteSheetUndead.textures["undead-walk-5.png"],
      spriteSheetUndead.textures["undead-walk-6.png"],
      spriteSheetUndead.textures["undead-walk-7.png"],
      spriteSheetUndead.textures["undead-walk-8.png"],
    ],
    death: [
      spriteSheetUndead.textures["undead-death-1.png"],
      spriteSheetUndead.textures["undead-death-2.png"],
      spriteSheetUndead.textures["undead-death-3.png"],
      spriteSheetUndead.textures["undead-death-4.png"],
      spriteSheetUndead.textures["undead-death-5.png"],
      spriteSheetUndead.textures["undead-death-6.png"],
      spriteSheetUndead.textures["undead-death-7.png"],
      spriteSheetUndead.textures["undead-death-8.png"],
      spriteSheetUndead.textures["undead-death-9.png"],
      spriteSheetUndead.textures["undead-death-10.png"],
      spriteSheetUndead.textures["undead-death-11.png"],
      spriteSheetUndead.textures["undead-death-12.png"],
    ],
    hurt: [
      spriteSheetUndead.textures["undead-hurt-1.png"],
      spriteSheetUndead.textures["undead-hurt-2.png"],
      spriteSheetUndead.textures["undead-hurt-3.png"],
      spriteSheetUndead.textures["undead-hurt-4.png"],
      spriteSheetUndead.textures["undead-hurt-5.png"],
      spriteSheetUndead.textures["undead-hurt-6.png"],
      spriteSheetUndead.textures["undead-hurt-7.png"],
      spriteSheetUndead.textures["undead-hurt-8.png"],
      spriteSheetUndead.textures["undead-hurt-9.png"],
    ],
  }, "walk")
  sprite.anchor.x = 0.48
  sprite.anchor.y = 0.44
  sprite.animationSpeed = ANIMATION_SPEED
  return sprite
}

export const createDefenderSprite = () => {
  const sprite = new TimedAnimatedSprite({
    idle: [
      spriteSheet.textures["defender_1.png"],
      spriteSheet.textures["defender_2.png"],
      spriteSheet.textures["defender_3.png"],
      spriteSheet.textures["defender_4.png"],
      spriteSheet.textures["defender_5.png"],
      spriteSheet.textures["defender_6.png"],
      spriteSheet.textures["defender_7.png"],
      spriteSheet.textures["defender_8.png"],
    ],
    hurt: [
      spriteSheet.textures["defender_1.png"],
      spriteSheet.textures["defender_2.png"],
      spriteSheet.textures["defender_3.png"],
      spriteSheet.textures["defender_4.png"],
      spriteSheet.textures["defender_5.png"],
      spriteSheet.textures["defender_6.png"],
      spriteSheet.textures["defender_7.png"],
      spriteSheet.textures["defender_8.png"],
    ],
    death: [
      spriteSheet.textures["defender_1.png"],
      spriteSheet.textures["defender_2.png"],
      spriteSheet.textures["defender_3.png"],
      spriteSheet.textures["defender_4.png"],
      spriteSheet.textures["defender_5.png"],
      spriteSheet.textures["defender_6.png"],
      spriteSheet.textures["defender_7.png"],
      spriteSheet.textures["defender_8.png"],
    ]
  }, "idle")
  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.7
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.play()
  return sprite
}

export const createSpriteProjectile = () => {
  const sprite = new PIXI.AnimatedSprite([
    spriteSheet.textures["ice_projectile_1.png"],
    spriteSheet.textures["ice_projectile_2.png"],
    spriteSheet.textures["ice_projectile_3.png"],
    spriteSheet.textures["ice_projectile_4.png"],
    spriteSheet.textures["ice_projectile_5.png"],
    spriteSheet.textures["ice_projectile_6.png"],
    spriteSheet.textures["ice_projectile_7.png"],
    spriteSheet.textures["ice_projectile_8.png"],
    spriteSheet.textures["ice_projectile_9.png"],
    spriteSheet.textures["ice_projectile_10.png"],
    spriteSheet.textures["ice_projectile_11.png"],
    spriteSheet.textures["ice_projectile_12.png"],
  ])
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.play()
  return sprite
}

export const createSpriteTile = (tileNumber?: number) => {
  const variation = tileNumber ?? Math.floor(Math.random() * 4) + 1
  const sprite = new PIXI.Sprite(spriteSheetGrass.textures[`grass_tile_${variation}.png`])
  sprite.anchor.set(0.5)
  return sprite
}

export const createSpriteUITile = () => {
  const sprite = new PIXI.Sprite(spriteSheetUI.textures[`buttonSquare_beige.png`])
  sprite.anchor.set(0.5)
  return sprite
}
