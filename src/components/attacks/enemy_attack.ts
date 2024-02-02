import * as PIXI from "pixi.js"
import { Component } from "../../core/component"
import { CollisionRegion } from "../../core/collision_region"

export class EnemyAttack extends Component {

  private x: number
  private y: number
  private damage: number

  /// #if DEBUG
  public debug_container: PIXI.Container
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
    this.x = x
    this.y = y

    /// #if DEBUG
    this.debug_container = new PIXI.Container()
    this.debug_container.name = this.UID
    this.debug_container.x = x
    this.debug_container.y = y
    container.addChild(this.debug_container)
    const collider = new PIXI.Graphics();
    collider.lineStyle(2, 0xFF0000); 
    collider.beginFill(0xFF0000, 0.5);
    collider.drawCircle(0, 0, this.getCollisionRegion().radius);
    collider.endFill();
    this.debug_container.addChild(collider)
    this.debug_damage = new PIXI.Text(this.damage, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xFFFFFF,
      align: "center",
    });
    this.debug_damage.anchor.set(0.5)
    this.debug_container.addChild(this.debug_damage)
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

    /// #if DEBUG
    this.debug_container.destroy()
    /// #endif
  }

  getCollisionRegion(): CollisionRegion {
    return {
      center: {
        x: this.x,
        y: this.y
      },
      radius: 30
    }
  }
}
