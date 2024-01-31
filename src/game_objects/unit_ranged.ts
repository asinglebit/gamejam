import * as PIXI from "pixi.js"
import { GameObject } from "../core/game_object"
import { createSpriteRanged } from "../utils/sprites"
import { nanoid } from "nanoid"

export class UnitRanged extends GameObject {
  private sprite: PIXI.AnimatedSprite
  private projectileTimer = 0

  constructor({ x, y }: Coordinates, container: PIXI.Container) {
    super()
    this.UID = `UnitRanged_${nanoid()}`
    this.sprite = createSpriteRanged()
    this.sprite.x = x
    this.sprite.y = y
    container.addChild(this.sprite)
  }

  update(delta: number) {
    this.projectileTimer += delta
    if (this.projectileTimer >= 80) {
      this.projectileTimer = 0
    }
  }

  pause() {
    this.sprite.stop()
  }

  play() {
    this.sprite.play()
  }

  unmount() {
    super.unmount()
  }
}

