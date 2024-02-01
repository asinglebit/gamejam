import * as PIXI from "pixi.js"
import { Component, IComponent } from "../core/component"
import { createSpriteProjectile } from "../utils/sprites"
import { CollisionRegion } from "../core/collision_region"

export class Projectile extends Component {

  public sprite: PIXI.AnimatedSprite
  private speed: number
  private damage: number = 1

  constructor(
    { x, y }: Coordinates,
    container: PIXI.Container,
    speed = 5
  ) {

    // Super constructor
    super("Projectile")

    // Store arguments
    this.speed = speed

    // Initialize component
    this.sprite = createSpriteProjectile()
    this.sprite.x = x
    this.sprite.y = y
    container.addChild(this.sprite)

    // Debug collision region
    const debug  = new PIXI.Graphics();
    debug.lineStyle(2, 0xFF0000); 
    debug.drawCircle(0, 0, this.getCollisionRegion().radius);
    debug.endFill();
    this.sprite.addChild(debug)
  }
  
  move(x: number, dt: number) {
    return x + this.speed * dt
  }

  onHit() {
    this.shouldBeUnmounted = true
  }

  getDamage() {
    return this.damage
  }

  update(delta: number) {
    this.sprite.x = this.move(this.sprite.x, delta)
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

  getCollisionRegion(): CollisionRegion {
    return {
      center: {
        x: this.sprite.x,
        y: this.sprite.y
      },
      radius: 10
    }
  }
}
