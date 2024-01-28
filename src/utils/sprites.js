import * as PIXI from "pixi.js"

let RANGED_ANIMATIONS

let spriteSheet

// Load spritesheet

export const loadSprites = async () => {
  spriteSheet = await PIXI.Assets.load("/resources/sprites.json")
  RANGED_ANIMATIONS = {
    attack: [
      spriteSheet.textures["ranged_attack_9.png"],
      spriteSheet.textures["ranged_attack_10.png"],
      spriteSheet.textures["ranged_attack_11.png"],
      spriteSheet.textures["ranged_attack_12.png"],
      spriteSheet.textures["ranged_attack_13.png"],
      spriteSheet.textures["ranged_attack_14.png"],
      spriteSheet.textures["ranged_attack_15.png"],
      spriteSheet.textures["ranged_attack_16.png"],
      spriteSheet.textures["ranged_attack_17.png"],
      spriteSheet.textures["ranged_attack_18.png"],
      spriteSheet.textures["ranged_attack_19.png"],
      spriteSheet.textures["ranged_attack_20.png"],
      spriteSheet.textures["ranged_attack_21.png"],
      spriteSheet.textures["ranged_attack_22.png"],
    ],
    idle: [
      spriteSheet.textures["ranged_idle_1.png"],
      spriteSheet.textures["ranged_idle_2.png"],
      spriteSheet.textures["ranged_idle_3.png"],
      spriteSheet.textures["ranged_idle_4.png"],
      spriteSheet.textures["ranged_idle_5.png"],
      spriteSheet.textures["ranged_idle_6.png"],
      spriteSheet.textures["ranged_idle_7.png"],
      spriteSheet.textures["ranged_idle_8.png"],
    ],
  }
}

// Create sprites

export const createSpriteUndead = () => {
  const sprite = new PIXI.AnimatedSprite([
    spriteSheet.textures["Undead-wal_1.png"],
    spriteSheet.textures["Undead-wal_2.png"],
    spriteSheet.textures["Undead-wal_3.png"],
    spriteSheet.textures["Undead-wal_4.png"],
    spriteSheet.textures["Undead-wal_5.png"],
    spriteSheet.textures["Undead-wal_6.png"],
    spriteSheet.textures["Undead-wal_7.png"],
    spriteSheet.textures["Undead-wal_8.png"],
  ])
  sprite.anchor.set(0.5)
  sprite.animationSpeed = 0.1666
  sprite.play()
  return sprite
}

export const createSpriteRanged = () => {
  const sprite = new PIXI.AnimatedSprite(RANGED_ANIMATIONS["attack"])
  // TODO set correct anchor point
  sprite.anchor.set(0.5)
  sprite.animationSpeed = 0.1666
  sprite.play()
  return sprite
}

export const createSpriteTile = (tileNumber) => {
  const variation = tileNumber ?? Math.floor(Math.random() * 4) + 1
  const sprite = new PIXI.Sprite(spriteSheet.textures[`grass_tile_${variation}.png`])
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
  sprite.animationSpeed = 0.1666
  sprite.play()
  return sprite
}