import * as PIXI from "pixi.js"
import { Component, IComponent } from "../core/component"
import { createSpriteProjectile } from "../utils/sprites"
import { CollisionRegion } from "../core/collision_region"

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

    // Debug collision region
    const debug  = new PIXI.Graphics();
    debug.lineStyle(2, 0xFF0000); 
    debug.drawCircle(0, 0, this.getCollisionRegion().radius);
    debug.endFill();
    this.sprite.addChild(debug)
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

  getCollisionRegion(): CollisionRegion {
    return {
      center: {
        x: this.sprite.x,
        y: this.sprite.y
      },
      radius: 10
    }
  }

  isIntersecting(component: IComponent): boolean {
    const selfCR = this.getCollisionRegion()
    const otherCR = component.getCollisionRegion()

    if (!selfCR || !otherCR) return false

    var a = selfCR.center.x - otherCR.center.x;
    var b = selfCR.center.y - otherCR.center.y;
    const distance = Math.sqrt(a * a + b * b)

    return (distance <= selfCR.radius + otherCR.radius)
  }
}
