import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { createSpriteRangedIdle, createSpriteRangedAttack, RANGED_ANIMATIONS } from "../utils/sprites"
import { ANIMATION_SPEED } from "../constants"

export class UnitRanged extends Component {

  private sprite: PIXI.AnimatedSprite
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
    this.sprite = createSpriteRangedIdle()
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.gotoAndPlay(0);
    container.addChild(this.sprite)
  }

  update(delta: number) {
    const oldTime = this.timer
    this.timer += delta
    if (oldTime < this.switchToAttackPreparation && this.timer > this.switchToAttackPreparation) {
      this.sprite.textures = RANGED_ANIMATIONS["attack"]
      this.sprite.gotoAndPlay(0);
    } else if (oldTime < this.switchToAttack && this.timer > this.switchToAttack) {
      this.onFireProjectile()
    } else if (oldTime < this.switchToIdle && this.timer > this.switchToIdle) {
      this.sprite.textures = RANGED_ANIMATIONS["idle"]
      this.sprite.gotoAndPlay(0);
      this.timer = 0
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
  }
}

