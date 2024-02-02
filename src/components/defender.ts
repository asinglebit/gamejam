import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { Timer } from "../core/timer"
import { createDefenderSprite } from "../utils/sprites"
import { CollisionRegion } from "../core/collision_region"


export class Defender extends Component {
  private sprite: PIXI.AnimatedSprite

  // Sprite specifics
  private timer: Timer
  private health: number = 50
  // private currentAnimation: UnitRangedAnimation = "idle"

  /// #if DEBUG
  private debug_health: PIXI.Text
  /// #endif

  constructor({ x, y }: Coordinates, container: PIXI.Container) {
    // Super constructor
    super("UnitRanged")


    // Initialize component
    this.sprite = createDefenderSprite()
    // this.currentAnimation = "idle"
    this.sprite.name = this.UID
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.gotoAndPlay(0)
    container.addChild(this.sprite)

    this.timer = new Timer()

 

    /// #if DEBUG
    const collider = new PIXI.Graphics()
    collider.lineStyle(2, 0xff0000)
    collider.beginFill(0xff0000, 0.5)
    collider.drawCircle(0, 0, this.getCollisionRegion().radius)
    collider.endFill()
    this.sprite.addChild(collider)
    this.debug_health = new PIXI.Text(`HP:${this.health}`, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xffffff,
      align: "center",
      strokeThickness: 5,
    })
    this.debug_health.anchor.set(0.5)
    this.debug_health.y -= 40
    this.sprite.addChild(this.debug_health)
    /// #endif
  }

  onGetHit(damage: number) {
    this.health -= damage
    if (this.health <= 0) this.shouldBeUnmounted = true

    /// #if DEBUG
    this.debug_health.text = `HP:${this.health}`
    /// #endif
  }

  update(delta: number) {
    // this.timer.tick(delta)

  }

  // changeAnimation(animationName: UnitRangedAnimation, looped?: boolean) {
  //   this.currentAnimation = animationName
  //   this.sprite.textures = RANGED_ANIMATIONS[animationName]
  //   this.sprite.loop = looped
  //   this.sprite.gotoAndPlay(0)
  // }

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
        y: this.sprite.y,
      },
      radius: 20,
    }
  }
}
