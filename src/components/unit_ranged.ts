import * as PIXI from "pixi.js"
import { Component } from "../core/component"
import { Timer } from "../core/timer"
import { createSpriteRangedIdle, RANGED_ANIMATIONS } from "../utils/sprites"
import { ANIMATION_SPEED } from "../constants"
import { CollisionRegion } from "../core/collision_region"

export class UnitRanged extends Component {

  private sprite: PIXI.AnimatedSprite
  private onFireProjectile: VoidFunction = null

  // Sprite specifics
  private timer: Timer
  private health: number = 5

  /// #if DEBUG
      private debug_health: PIXI.Text
  /// #endif

  private canShoot = true

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
    this.sprite.name = this.UID
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.gotoAndPlay(0);
    container.addChild(this.sprite)


    this.timer = new Timer()


    this.timer.repeat("shoot", 120, () => {
      console.log(11)
      this.canShoot = true
      this.sprite.textures = RANGED_ANIMATIONS["attack"]
      this.sprite.loop = false
      this.sprite.gotoAndPlay(0)

      this.sprite.onComplete = () => {
        this.sprite.textures = RANGED_ANIMATIONS["idle"]
        this.sprite.gotoAndPlay(0)
      }
    })
    // create infinite timer for attacks

    // each X ticks => switch animation and set canShoot = true

    
    // Animation frame duration
    // TODO: Probably needs to be extracted into a separate abstraction together with sprite factory
    // Very shaky magical code, needs more investigation
    // const frameDuration = 6 * ANIMATION_SPEED
    // Animation durations
    // const switchToAttackPreparation = RANGED_ANIMATIONS["idle"].length * frameDuration
    // const switchToAttack = switchToAttackPreparation + RANGED_ANIMATIONS["attack_prepare"].length * frameDuration
    // const switchToIdle = switchToAttack + RANGED_ANIMATIONS["attack_complete"].length * frameDuration



    // // Initialize timer
    // this.timer = new Timer([{
    //     checkpoint: switchToAttackPreparation,
    //     callback: () => {
    //       this.sprite.textures = RANGED_ANIMATIONS["attack_prepare"]
    //       this.sprite.gotoAndPlay(0);
    //     }
    //   }, {
    //     checkpoint: switchToAttack,
    //     callback: () => {
    //       this.sprite.textures = RANGED_ANIMATIONS["attack_complete"]
    //       this.sprite.gotoAndPlay(0);
    //       this.onFireProjectile()
    //     }
    //   }, {
    //     checkpoint: switchToIdle,
    //     callback: () => {
    //       this.sprite.textures = RANGED_ANIMATIONS["idle"]
    //       this.sprite.gotoAndPlay(0);
    //     }
    //   }
    //   // setInterval(() => {
    //   //   this.canShoot = true
    //   // }, 1)
    // ])
    
    /// #if DEBUG
        const collider = new PIXI.Graphics();
        collider.lineStyle(2, 0xFF0000); 
        collider.beginFill(0xFF0000, 0.5);
        collider.drawCircle(0, 0, this.getCollisionRegion().radius);
        collider.endFill();
        this.sprite.addChild(collider)
        this.debug_health = new PIXI.Text(`HP:${this.health}`, {
          fontFamily: "Arial",
          fontSize: 18,
          fill: 0xFFFFFF,
          align: "center",
          strokeThickness: 5
        });
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
    this.timer.tick(delta)

    
    // if canShoot && current_frame === X && animation === 'attack'
    //   spawn buttet
    //   set canShoot false
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
