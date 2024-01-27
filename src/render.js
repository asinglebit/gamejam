import * as PIXI from "pixi.js"

export let spriteSheet
let RANGED_ANIMATIONS

export const CELL_SIZE = 128

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

export const renderUndead = (container, col, row) => {
  const undeadSprite = new PIXI.AnimatedSprite([
    spriteSheet.textures["Undead-wal_1.png"],
    spriteSheet.textures["Undead-wal_2.png"],
    spriteSheet.textures["Undead-wal_3.png"],
    spriteSheet.textures["Undead-wal_4.png"],
    spriteSheet.textures["Undead-wal_5.png"],
    spriteSheet.textures["Undead-wal_6.png"],
    spriteSheet.textures["Undead-wal_7.png"],
    spriteSheet.textures["Undead-wal_8.png"],
  ])
  undeadSprite.anchor.set(0.5)
  undeadSprite.x = col * CELL_SIZE + CELL_SIZE / 2
  undeadSprite.y = row * CELL_SIZE + CELL_SIZE / 2
  undeadSprite.play()
  undeadSprite.animationSpeed = 0.1666

  container.addChild(undeadSprite)

  return undeadSprite
}

export const renderRanged = (container, col, row) => {
  const rangedSprite = new PIXI.AnimatedSprite(RANGED_ANIMATIONS["attack"])

  // TODO set correct anchor point
  rangedSprite.anchor.set(0.5)
  rangedSprite.x = col * CELL_SIZE + CELL_SIZE / 2
  rangedSprite.y = row * CELL_SIZE + CELL_SIZE / 2
  rangedSprite.play()
  rangedSprite.animationSpeed = 0.1666

  container.addChild(rangedSprite)

  // change animation
  // rangedSprite.textures = RANGED_ANIMATIONS["idle"]
  // rangedSprite.play()
}

export const renderTile = (container, col, row, tileNumber) => {
  if (!tileNumber) {
    tileNumber = Math.floor(Math.random() * 4) + 1
  }
  const tile = new PIXI.Sprite(spriteSheet.textures[`grass_tile_${tileNumber}.png`])

  tile.x = col * CELL_SIZE
  tile.y = row * CELL_SIZE
  container.addChild(tile)
  return tile
}

export const createBulletSprite = () => {
  const projectileSprite = new PIXI.AnimatedSprite([
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

  projectileSprite.animationSpeed = 0.1666
  projectileSprite.play()

  return projectileSprite
}
