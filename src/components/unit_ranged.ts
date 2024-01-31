import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { createSpriteRangedIdle, createSpriteRangedAttack } from "../utils/sprites"
import { ANIMATION_SPEED } from "../constants"

export class UnitRanged extends Component {

  private sprite_idle: PIXI.AnimatedSprite
  private sprite_attack: PIXI.AnimatedSprite
  private timer = 0
  private onFireProjectile: VoidFunction = null

  // TODO: Probably needs to be extracted into a separate abstraction together with sprite factory
  // very shaky magical code, needs more investigation
  private frameDuration = PIXI.Ticker.shared.FPS / 2 * ANIMATION_SPEED

  // Sprite specifics
  private idleFrameCount = 14
  private attackPreparationFrameCount = 3
  private attackCompletionFrameCount = 5
  private switchToAttackPreparation = this.idleFrameCount * this.frameDuration
  private switchToAttack = this.switchToAttackPreparation + this.attackPreparationFrameCount * this.frameDuration
  private switchToIdle = this.switchToAttack + this.attackCompletionFrameCount * this.frameDuration

  constructor(
    { x, y }: Coordinates,
    container: PIXI.Container,
    onFireProjectile?: VoidFunction
  ) {

    // Super constructor
    super("UnitRanged")

    // Store arguments
    this.onFireProjectile = onFireProjectile

    // Initialize component
    this.sprite_idle = createSpriteRangedIdle()
    this.sprite_idle.x = x
    this.sprite_idle.y = y
    this.sprite_idle.gotoAndPlay(0);
    container.addChild(this.sprite_idle)
    this.sprite_attack = createSpriteRangedAttack()
    this.sprite_attack.x = x
    this.sprite_attack.y = y
    this.sprite_attack.visible = false
    container.addChild(this.sprite_attack)
    
  }

  update(delta: number) {
    const oldTime = this.timer
    this.timer += delta

    if (oldTime < this.switchToAttackPreparation && this.timer > this.switchToAttackPreparation) {
      this.sprite_idle.stop()
      this.sprite_idle.visible = false
      this.sprite_attack.gotoAndPlay(0);
      this.sprite_attack.visible = true
    } else if (oldTime < this.switchToAttack && this.timer > this.switchToAttack) {
      this.onFireProjectile()
    } else if (oldTime < this.switchToIdle && this.timer > this.switchToIdle) {
      this.sprite_idle.gotoAndPlay(0);
      this.sprite_idle.visible = true
      this.sprite_attack.stop()
      this.sprite_attack.visible = false
      this.timer = 0
    }
  }

  pause() {
    this.sprite_idle.stop()
    this.sprite_attack.stop()
  }

  play() {
    if (this.sprite_idle.visible) this.sprite_idle.stop()
    else this.sprite_attack.play()    
  }

  unmount() {
    super.unmount()
  }
}

