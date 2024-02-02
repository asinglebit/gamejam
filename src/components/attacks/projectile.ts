import * as PIXI from "pixi.js"
import { Component, IComponent } from "../../core/component"
import { createSpriteProjectile } from "../../utils/sprites"
import { CollisionRegion } from "../../core/collision_region"

export class Projectile extends Component {

  public sprite: PIXI.AnimatedSprite
  private speed: number
  private damage: number = 1

  /// #if DEBUG
      private debug_damage: PIXI.Text
  /// #endif

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
    this.sprite.name = this.UID
    this.sprite.x = x
    this.sprite.y = y
    container.addChild(this.sprite)

    /// #if DEBUG
        const collider = new PIXI.Graphics();
        collider.lineStyle(2, 0xFF0000); 
        collider.beginFill(0xFF0000, 0.5);
        collider.drawCircle(0, 0, this.getCollisionRegion().radius);
        collider.endFill();
        this.sprite.addChild(collider)
        this.debug_damage = new PIXI.Text(this.damage, {
          fontFamily: "Arial",
          fontSize: 18,
          fill: 0xFFFFFF,
          align: "center",
        });
        this.debug_damage.anchor.set(0.5)
        this.sprite.addChild(this.debug_damage)
    /// #endif
  }
  
  move(x: number, dt: number) {
    return x + this.speed * dt
  }

  attack() {
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
