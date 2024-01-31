import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { createSpriteProjectile } from "../utils/sprites"

export class Projectile extends Component {

  public sprite: PIXI.AnimatedSprite
  private speed: number
  private onHit: VoidFunction = null

  constructor(
    { x, y }: Coordinates,
    container: PIXI.Container,
    speed = 5,
    onHit?: VoidFunction
  ) {

    // Super constructor
    super("Projectile")

    // Store arguments
    this.speed = speed
    this.onHit = onHit

    // Initialize component
    this.sprite = createSpriteProjectile()
    this.sprite.x = x
    this.sprite.y = y
    container.addChild(this.sprite)
  }
  
  move (x: number, dt: number) {
    return x + this.speed * dt
  }

  update(delta: number) {
    this.sprite.x = this.move(this.sprite.x, delta)

    // Determine hit or miss conditions
    if (this.sprite.x > 1280) {
        this.shouldBeUnmounted = true
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
    this.sprite.destroy()
  }
}
