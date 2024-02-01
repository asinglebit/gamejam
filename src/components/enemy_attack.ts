import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { createSpriteProjectile } from "../utils/sprites"
import { CollisionRegion } from "../core/collision_region"

export class EnemyAttack extends Component {

  public sprite: PIXI.AnimatedSprite
  private damage: number

  /// #if DEBUG
      private debug_damage: PIXI.Text
  /// #endif

  constructor(
    { x, y }: Coordinates,
    container: PIXI.Container,
    damage: number
  ) {

    // Super constructor
    super("EnemyAttack")

    // Store arguments
    this.damage = damage

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

  getDamage() {
    return this.damage
  }

  update(delta: number) {
    this.shouldBeUnmounted = true
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
      radius: 30
    }
  }
}
