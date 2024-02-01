import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { createSpriteUndead } from "../utils/sprites"
import { CollisionRegion } from "../core/collision_region"

export class Enemy extends Component {

  public sprite: PIXI.AnimatedSprite
  private speed: number = 2
  private health: number = 2
  private debug_health: PIXI.Text

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
    
    // Debug
    const collider = new PIXI.Graphics();
    collider.lineStyle(2, 0xFF0000); 
    collider.drawCircle(0, 0, this.getCollisionRegion().radius);
    collider.endFill();
    this.sprite.addChild(collider)
    this.debug_health = new PIXI.Text(this.health, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xFF0000,
      align: "center",
    });
    this.debug_health.anchor.set(0.5)
    this.sprite.addChild(this.debug_health)
  }
  
  move(x: number, dt: number) {
    return x - this.speed * dt
  }

  onGetHit(damage: number) {
    this.health -= damage
    this.debug_health.text = this.health
    if (this.health <= 0) this.shouldBeUnmounted = true
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
  
  getCollisionRegion(): CollisionRegion {
    return {
      center: {
        x: this.sprite.x,
        y: this.sprite.y
      },
      radius: 20
    }
  }
}

