import * as PIXI from "pixi.js"
import { Sequencer } from "../../core/sequencer"
import { Component } from "../../core/component"
import { CollisionRegion } from "../../core/collision_region"
import { TimedAnimatedSprite } from "../../core/timed_animated_sprite"
import { createSpriteUndead } from "../../utils/sprites"
import { FONT_FAMILY } from "../../constants"

export class Enemy extends Component {
  public sprite: TimedAnimatedSprite
  private speed: number = 2
  private health: number = 15
  private sequencer: Sequencer
  private damage: number = 2
  private attackSpeed: number = 36
  private onReachEnd: VoidFunction
  private onAttack: (coordinates: Coordinates, damage: number) => void

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
    this.onAttack = onAttack

    // Initialize component
    this.sprite = createSpriteUndead()
    this.sprite.name = this.UID
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.zIndex = 1
    this.sprite.scale.x = -2
    this.sprite.scale.y = 2
    this.sprite.gotoAndPlay(0)
    container.addChild(this.sprite)

    // Filters
    const lightFilter = new PIXI.ColorMatrixFilter()
    lightFilter.matrix = [ 
      1, 0, 0, 0, 0.15, 
      0, 1, 0, 0, 0.15, 
      0, 0, 1, 0, 0.15, 
      0, 0, 0, 1, 0
    ];

    // Initialize timer
    this.sequencer = new Sequencer()

    this.sequencer.repeat("walk", {
      duration: 0,
      callback: (delta) => {
        this.sprite.x -= this.speed * delta
        if (this.sprite.x <= 0) {
          this.onReachEnd()
        }
      }
    })

    this.sequencer.repeatSequence("attack", [{
      duration: 0,
      callback: () => {
        this.sprite.switch("attack")
        this.sprite.play()
      }
    }, {
      duration: 7,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.onAttack({ x: this.sprite.x, y: this.sprite.y }, this.damage)
      }
    }, {
      duration: 11,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sequencer.pause("attack")
        this.sequencer.unpause("walk")
        this.sprite.switch("walk")
        this.sprite.play()
      }
    }], true)

    this.sequencer.repeatSequence("hurt_and_stun", [{
      duration: 0,
      callback: () => {
        this.sequencer.pause("walk")
        this.sprite.switch("hurt")
        this.sprite.play()
      }
    }, {
      duration: 9,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sequencer.pause("hurt_and_stun")
        this.sequencer.unpause("walk")
        this.sprite.switch("walk")
        this.sprite.play()
      }
    }], true)
    
    this.sequencer.repeatSequence("hurt", [{
      duration: 0,
      callback: () => {
        this.sprite.filters = [lightFilter]
      }
    },{
      duration: 3,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sprite.filters = []
        this.sequencer.pause("hurt")
      }
    }], true)

    this.sequencer.onceSequence("death", [{
      duration: 0,
      callback: () => {
        this.sprite.switch("death")
        this.sprite.play()
        this.sprite.loop = false
        // More fun this way
        // this.shouldBeUnmounted = true
        /// #if DEBUG
        collider.visible = false
        this.debug_health.visible = false
        /// #endif
      }
    }], true)

    /// #if DEBUG
    const collider = new PIXI.Graphics()
    collider.lineStyle(2, 0xff0000)
    collider.drawCircle(0, 0, this.getCollisionRegion().radius)
    collider.endFill()
    collider.scale.set(0.5)
    this.sprite.addChild(collider)
    this.debug_health = new PIXI.Text(`HP:${this.health}\nDMG:${this.damage}/${this.attackSpeed}`, {
      fontFamily: FONT_FAMILY,
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 5
    })
    this.debug_health.anchor.set(0.5)
    this.debug_health.y -= 50
    this.debug_health.scale.x = -0.5
    this.debug_health.scale.y = 0.5
    this.sprite.addChild(this.debug_health)
    /// #endif
  }
  
  attack() {
    this.sequencer.pause("walk")
    this.sequencer.unpause("attack")
  }

  hit(damage: number) {
    // We are dead already
    if (this.health <= 0) return
    
    this.health -= damage
    if (this.health <= 0) {
      this.sequencer.pause("attack")
      this.sequencer.pause("hurt")
      this.sequencer.pause("hurt_and_stun")
      this.sequencer.pause("walk")
      this.sequencer.unpause("death")
    } else {
      if (this.sequencer.isPaused("hurt") && this.sequencer.isPaused("hurt_and_stun")) {
        this.sequencer.unpause(Math.random() < 0.5 ? "hurt" : "hurt_and_stun")
      }
    }

    /// #if DEBUG
    this.debug_health.text = `HP:${this.health}\nDMG:${this.damage}/${this.attackSpeed}`
    /// #endif
  }

  update(delta: number) {
    this.sequencer.tick(delta)
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
    return this.health <= 0 ? null : {
      center: {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      radius: 30,
    }
  }
}
