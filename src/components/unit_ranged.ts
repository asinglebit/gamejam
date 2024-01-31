import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { createSpriteRanged } from "../utils/sprites"

export class UnitRanged extends Component {

  private sprite: PIXI.AnimatedSprite
  private projectileTimer = 0

  constructor({ x, y }: Coordinates, container: PIXI.Container) {

    // Super constructor
    super("UnitRanged")

    // Initialize component
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

