import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { createSpriteUndead } from "../utils/sprites"
import { CollisionRegion } from "../core/collision_region"
import { Timer } from "../core/timer"

export enum ENEMY_ACTIVITY {
  WALK,
  ATTACK
}

export class Enemy extends Component {

  public sprite: PIXI.AnimatedSprite
  private speed: number = 2
  private health: number = 10
  public activity: ENEMY_ACTIVITY = ENEMY_ACTIVITY.WALK
  private attackTimer: Timer
  private damage: number = 1
  private attackSpeed: number = 100
  private onReachEnd: VoidFunction

  /// #if DEBUG
      private debug_health: PIXI.Text
  /// #endif

  constructor(
    { x, y }: Coordinates,
    container: PIXI.Container,
    onAttack: (coordinates: Coordinates, damage: number) => void,
    onReachEnd: VoidFunction
  ) {

    // Super constructor
    super("Enemy")

    // Store arguments
    this.onReachEnd = onReachEnd

    // Initialize component
    this.sprite = createSpriteUndead()
    this.sprite.name = this.UID
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.gotoAndPlay(0);
    container.addChild(this.sprite)

    // Initialize timer
  //   this.attackTimer = new Timer([{
  //     checkpoint: this.attackSpeed,
  //     callback: () => {
  //       onAttack({ x: this.sprite.x, y: this.sprite.y }, this.damage)
  //     }
  //   }
  // ])
    
    /// #if DEBUG
        const collider = new PIXI.Graphics();
        collider.lineStyle(2, 0xFF0000); 
        collider.beginFill(0xFF0000, 0.5);
        collider.drawCircle(0, 0, this.getCollisionRegion().radius);
        collider.endFill();
        this.sprite.addChild(collider)
        this.debug_health = new PIXI.Text(`HP:${this.health}\nDMG:${this.damage}/${this.attackSpeed}`, {
          fontFamily: "Arial",
          fontSize: 18,
          fill: 0xFFFFFF,
          align: "center",
          strokeThickness: 5
        });
        this.debug_health.anchor.set(0.5)
        this.debug_health.y -= 50
        this.sprite.addChild(this.debug_health)
    /// #endif
  }
  
  walk(dt: number) {
    this.sprite.x -= this.speed * dt
    if (this.sprite.x <= 0) {
      this.onReachEnd()
    }
  }
  
  attack(dt: number) {
    this.attackTimer.tick(dt)
  }

  onGetHit(damage: number) {
    this.health -= damage
    if (this.health <= 0) this.shouldBeUnmounted = true

    /// #if DEBUG
        this.debug_health.text = `HP:${this.health}\nDMG:${this.damage}/${this.attackSpeed}`
    /// #endif
  }

  update(delta: number) {
    switch (this.activity) {
      case ENEMY_ACTIVITY.WALK: 
        this.walk(delta)
        break
      case ENEMY_ACTIVITY.ATTACK: 
        this.attack(delta)
        this.activity = ENEMY_ACTIVITY.WALK
        break
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

