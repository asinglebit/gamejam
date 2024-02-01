import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { Timer } from "../core/timer"
import { createSpriteRangedIdle, RANGED_ANIMATIONS } from "../utils/sprites"
import { ANIMATION_SPEED } from "../constants"
import { CollisionRegion } from "../core/collision_region"

type UnitRangedAnimation = "attack" | "idle"

export class UnitRanged extends Component {
  private sprite: PIXI.AnimatedSprite
  private onFireProjectile: VoidFunction = null

  // Sprite specifics
  private timer: Timer
  private health: number = 5
  private currentAnimation: UnitRangedAnimation = "idle"

  /// #if DEBUG
  private debug_health: PIXI.Text
  /// #endif

  private canShoot = true

  constructor({ x, y }: Coordinates, container: PIXI.Container, onFireProjectile?: VoidFunction) {
    // Super constructor
    super("UnitRanged")

    // Store arguments
    this.onFireProjectile = onFireProjectile

    // Initialize component
    this.sprite = createSpriteRangedIdle()
    this.currentAnimation = "idle"
    this.sprite.name = this.UID
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.gotoAndPlay(0)
    container.addChild(this.sprite)

    this.timer = new Timer()

    this.timer.repeat("shoot", 120, () => {
      this.canShoot = true
      this.changeAnimation("attack", false)
    })

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

  isCanSpawnProjectile() {
    return this.currentAnimation === "attack" && this.sprite.currentFrame === 4 && this.canShoot
  }

  isAttackAnimationFinished() {
    return this.currentAnimation === "attack" && this.sprite.playing === false
  }

  update(delta: number) {
    this.timer.tick(delta)

    if (this.isCanSpawnProjectile()) {
      this.onFireProjectile()
      this.canShoot = false
    }

    this.isAttackAnimationFinished() && this.changeAnimation("idle", true)
  }

  changeAnimation(animationName: UnitRangedAnimation, looped?: boolean) {
    this.currentAnimation = animationName
    this.sprite.textures = RANGED_ANIMATIONS[animationName]
    this.sprite.loop = looped
    this.sprite.gotoAndPlay(0)
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
        y: this.sprite.y,
      },
      radius: 20,
    }
  }
}
