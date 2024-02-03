import * as PIXI from "pixi.js"
import { Component } from "../../core/component"
import { createSpriteProjectile } from "../../utils/sprites"
import { CollisionRegion } from "../../core/collision_region"
import { FONT_FAMILY } from "../../constants"

export class Swing extends Component {

  private x: number
  private y: number
  private damage: number = 4

  constructor(
    { x, y }: Coordinates,
    container: PIXI.Container,
    damage = 4
  ) {

    // Super constructor
    super("Swing")

    // Store arguments
    this.damage = damage
    this.x = x
    this.y = y
  }

  attack() {
    this.shouldBeUnmounted = true
  }

  getDamage() {
    return this.damage
  }

  update(delta: number) {
    this.shouldBeUnmounted = true
  }

  unmount() {
    super.unmount()
  }

  getCollisionRegion(): CollisionRegion {
    return {
      center: {
        x: this.x,
        y: this.y
      },
      radius: 40
    }
  }
}
