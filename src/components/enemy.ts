import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { createSpriteUndead } from "../utils/sprites"

export class Enemy extends Component {

  public sprite: PIXI.AnimatedSprite
  private speed: number = 2
  private onGetHit: VoidFunction = null

  constructor(
    { x, y }: Coordinates,
    container: PIXI.Container,
  ) {

    // Super constructor
    super("Enemy")

    // Initialize component
    this.sprite = createSpriteUndead()
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.gotoAndPlay(0);
    container.addChild(this.sprite)
    

  }
  
  move (x: number, dt: number) {
    return x - this.speed * dt
  }

  update(delta: number) {
    this.sprite.x = this.move(this.sprite.x, delta)
    
    if (this.sprite.x < 0) {
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

