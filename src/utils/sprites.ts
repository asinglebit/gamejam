import * as PIXI from "pixi.js"
import { CompositeTilemap } from '@pixi/tilemap';

import { ANIMATION_SPEED } from "../constants"
import { TimedAnimatedSprite } from "../core/timed_animated_sprite"


const spritesheets: Record<string, Record<string, any>> = {
  ui: {},
  characters: {},
  effects: {},
  props: {},
  terrain: {}
} 

// Load spritesheet
export const loadSprites = async () => {
  PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST
  spritesheets.ui = await PIXI.Assets.load("/assets/textures/ui/ui.json")
  spritesheets.characters.bat_1 = await PIXI.Assets.load("/assets/textures/characters/bat_1.json")
  spritesheets.characters.bat_2 = await PIXI.Assets.load("/assets/textures/characters/bat_2.json")
  spritesheets.characters.blacksmith = await PIXI.Assets.load("/assets/textures/characters/blacksmith.json")
  spritesheets.characters.moose_1 = await PIXI.Assets.load("/assets/textures/characters/moose_1.json")
  spritesheets.characters.moose_2 = await PIXI.Assets.load("/assets/textures/characters/moose_2.json")
  spritesheets.characters.moose_3 = await PIXI.Assets.load("/assets/textures/characters/moose_3.json")
  spritesheets.characters.moose_4 = await PIXI.Assets.load("/assets/textures/characters/moose_4.json")
  spritesheets.characters.moose_5 = await PIXI.Assets.load("/assets/textures/characters/moose_5.json")
  spritesheets.characters.moose_6 = await PIXI.Assets.load("/assets/textures/characters/moose_6.json")
  spritesheets.characters.ranged_1 = await PIXI.Assets.load("/assets/textures/characters/ranged_1.json")
  spritesheets.characters.ranged_2 = await PIXI.Assets.load("/assets/textures/characters/ranged_2.json")
  spritesheets.characters.stone_golem_1 = await PIXI.Assets.load("/assets/textures/characters/stone_golem_1.json")
  spritesheets.characters.stone_golem_2 = await PIXI.Assets.load("/assets/textures/characters/stone_golem_2.json")
  spritesheets.characters.undead = await PIXI.Assets.load("/assets/textures/characters/undead.json")
  spritesheets.characters.warrior = await PIXI.Assets.load("/assets/textures/characters/warrior.json")
  spritesheets.effects.ice_projectile = await PIXI.Assets.load("/assets/textures/effects/ice_projectile.json")
  spritesheets.props.grasslands = await PIXI.Assets.load("/assets/textures/props/grasslands.json")
  spritesheets.terrain.grasslands = await PIXI.Assets.load("/assets/textures/terrain/grasslands.json")
}

export const createTileMap = () => {
  const tilemap = new CompositeTilemap()
  for (let row_index = 0; row_index < 40; ++row_index) {
    for (let column_index = 0; column_index < 40; ++column_index) {
      const grassTiles = [
        "grass1_to_transp_7.png",
        "grass1_to_transp_11.png",
        "grass1_to_transp_12.png",
        "grass1_to_transp_12.png",
        "grass1_to_transp_12.png",
        "grass1_to_transp_12.png",
        "grass1_to_transp_13.png",
        "grass1_to_transp_17.png"
      ]
      const variation = Math.floor(Math.random() * 7)
      tilemap.tile(grassTiles[variation], column_index * 32, row_index * 32)
    }
  }  
  return tilemap
}

export const createSpriteTree = () => {
  const variation = Math.random() > 0.5 ? 1 : 2
  const sprite = new PIXI.AnimatedSprite([
    spritesheets.props.grasslands.textures[`Animated Tree${variation}_frame1.png`],
    spritesheets.props.grasslands.textures[`Animated Tree${variation}_frame2.png`],
    spritesheets.props.grasslands.textures[`Animated Tree${variation}_frame3.png`],
    spritesheets.props.grasslands.textures[`Animated Tree${variation}_frame4.png`],
    spritesheets.props.grasslands.textures[`Animated Tree${variation}_frame5.png`],
    spritesheets.props.grasslands.textures[`Animated Tree${variation}_frame6.png`],
    spritesheets.props.grasslands.textures[`Animated Tree${variation}_frame7.png`],
    spritesheets.props.grasslands.textures[`Animated Tree${variation}_frame8.png`],
  ])
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.anchor.x = 0.47
  sprite.anchor.y = 0.62
  sprite.play()
  return sprite
}

export const createSpriteShadow = () => {
  const sprite = new PIXI.Sprite(spritesheets.characters.warrior.textures["warrior_shadow.png"])
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
  const sprite = new PIXI.Sprite(spritesheets.props.grasslands.textures[props[variation]])
  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5
  return sprite
}

const extract: any = (obj: any, name: string, start: number, end: number) => {
  const result = []
  for (let i = start; i < end + 1; ++i) result.push(obj.textures[`${name}_${i}.png`])
  return result
}

export const createSpriteRanged = (variation: ( 1 | 2 ) = 1) => {
  const sprite = new TimedAnimatedSprite({
    attack_1: extract(spritesheets.characters[`ranged_${variation}`], `ranged_${variation}_attack_1`, 0, 16),
    attack_2: extract(spritesheets.characters[`ranged_${variation}`], `ranged_${variation}_attack_2`, 0, 13),
    death: extract(spritesheets.characters[`ranged_${variation}`], `ranged_${variation}_death`, 0, 8),
    hurt: extract(spritesheets.characters[`ranged_${variation}`], `ranged_${variation}_hurt`, 0, 7),
    idle: extract(spritesheets.characters[`ranged_${variation}`], `ranged_${variation}_idle`, 0, 7),
    walk: extract(spritesheets.characters[`ranged_${variation}`], `ranged_${variation}_walk`, 0, 7)
  }, "idle")
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.anchor.x = 0.42
  sprite.anchor.y = 0.59
  return sprite
}

export const createSpriteWarrior = () => {
  const sprite = new TimedAnimatedSprite({
    attack_1: extract(spritesheets.characters[`warrior`], `warrior_attack_1`, 0, 10),
    attack_2: extract(spritesheets.characters[`warrior`], `warrior_attack_2`, 0, 15),
    death: extract(spritesheets.characters[`warrior`], `warrior_death`, 0, 18),
    hurt: extract(spritesheets.characters[`warrior`], `warrior_hurt`, 0, 7),
    idle: extract(spritesheets.characters[`warrior`], `warrior_idle`, 0, 15),
    walk: extract(spritesheets.characters[`warrior`], `warrior_walk`, 0, 7)
  }, "idle")
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.anchor.x = 0.47
  sprite.anchor.y = 0.62
  return sprite
}

export const createSpriteBlacksmith = () => {
  const sprite = new TimedAnimatedSprite({
    idle: extract(spritesheets.characters[`blacksmith`], `blacksmith_idle`, 0, 5),
    produce: [
      ...extract(spritesheets.characters[`blacksmith`], `blacksmith_transition`, 0, 4).reverse(),
      ...extract(spritesheets.characters[`blacksmith`], `blacksmith_produce`, 0, 12),
      ...extract(spritesheets.characters[`blacksmith`], `blacksmith_transition`, 0, 4)
    ],
  }, "idle")
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.anchor.x = 0.47
  sprite.anchor.y = 0.62
  return sprite
}

export const createSpriteAnvil = () => {
  const sprite = new PIXI.AnimatedSprite(
    extract(spritesheets.characters[`blacksmith`], `blacksmith_anvil`, 0, 5)
  )
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.anchor.x = 0.47
  sprite.anchor.y = 0.62
  return sprite
}

export const createSpriteUndead = () => {
  const sprite = new TimedAnimatedSprite({
    attack: extract(spritesheets.characters[`undead`], `undead_attack`, 0, 17),
    death: extract(spritesheets.characters[`undead`], `undead_death`, 0, 11),
    hurt: extract(spritesheets.characters[`undead`], `undead_hurt`, 0, 8),
    idle_1: extract(spritesheets.characters[`undead`], `undead_idle_1`, 0, 7),
    idle_2: extract(spritesheets.characters[`undead`], `undead_idle_2`, 0, 7),
    walk: extract(spritesheets.characters[`undead`], `undead_walk`, 0, 7),
  }, "walk")
  sprite.anchor.x = 0.48
  sprite.anchor.y = 0.44
  sprite.animationSpeed = ANIMATION_SPEED
  return sprite
}

export const createSpriteStoneGolem = (variation: ( 1 | 2 ) = 1) => {
  const sprite = new TimedAnimatedSprite({
    attack: extract(spritesheets.characters[`stone_golem_${variation}`], `stone_golem_${variation}_attack`, 0, 16),
    death: extract(spritesheets.characters[`stone_golem_${variation}`], `stone_golem_${variation}_death`, 0, 12),
    hurt: extract(spritesheets.characters[`stone_golem_${variation}`], `stone_golem_${variation}_hurt`, 0, 11),
    idle: extract(spritesheets.characters[`stone_golem_${variation}`], `stone_golem_${variation}_idle`, 0, 7),
    walk: extract(spritesheets.characters[`stone_golem_${variation}`], `stone_golem_${variation}_walk`, 0, 7),
  }, "idle")
  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.7
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.play()
  return sprite
}

export const createMooseSprite = (variation: ( 1 | 2 | 3 | 4 | 5 | 6 ) = 1) => {
  const sprite = new TimedAnimatedSprite({
    attack: extract(spritesheets.characters[`moose_${variation}`], `moose_${variation}_attack`, 0, 29),
    death: extract(spritesheets.characters[`moose_${variation}`], `moose_${variation}_death`, 0, 14),
    hurt: extract(spritesheets.characters[`moose_${variation}`], `moose_${variation}_hurt`, 0, 5),
    idle: extract(spritesheets.characters[`moose_${variation}`], `moose_${variation}_idle`, 0, 7),
    walk: extract(spritesheets.characters[`moose_${variation}`], `moose_${variation}_walk`, 0, 7),
  }, "idle")
  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.7
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.play()
  return sprite
}

export const createBatSprite = (variation: ( 1 | 2 ) = 1) => {
  const sprite = new TimedAnimatedSprite({
    attack: extract(spritesheets.characters[`bat_${variation}`], `bat_${variation}_attack`, 0, 7),
    attack_full: extract(spritesheets.characters[`bat_${variation}`], `bat_${variation}_attack_full`, 0, 14),
    attack_walk_attack_transition: extract(spritesheets.characters[`bat_${variation}`], `bat_${variation}_attack_walk_attack_transition`, 0, 6),
    death: extract(spritesheets.characters[`bat_${variation}`], `bat_${variation}_death`, 0, 13),
    hurt: extract(spritesheets.characters[`bat_${variation}`], `bat_${variation}_hurt`, 0, 8),
    idle: extract(spritesheets.characters[`bat_${variation}`], `bat_${variation}_idle`, 0, 7),
    walk: extract(spritesheets.characters[`bat_${variation}`], `bat_${variation}_walk`, 0, 7),
  }, "idle")
  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.7
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.play()
  return sprite
}

export const createSpriteProjectile = () => {
  const sprite = new PIXI.AnimatedSprite(
    extract(spritesheets.effects[`ice_projectile`], `ice_projectile`, 0, 11)
  )
  sprite.animationSpeed = ANIMATION_SPEED
  sprite.play()
  return sprite
}

export const createSpriteUIButton = () => {
  const sprite = new PIXI.Sprite(spritesheets.ui.textures[`buttonSquare_beige.png`])
  sprite.anchor.set(0.5)
  return sprite
}
