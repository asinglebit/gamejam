import * as PIXI from "pixi.js"

import { Component } from "../../core/component"
import { Sequencer } from "../../core/sequencer"
import { CollisionRegion } from "../../core/collision_region"
import { TimedAnimatedSprite } from "../../core/timed_animated_sprite"
import { createSpriteWarrior } from "../../utils/sprites"
import { FONT_FAMILY } from "../../constants"
import { soundScream, soundSlash } from "../../utils/sounds"

export class Melee extends Component {
  private sprite: TimedAnimatedSprite
  private onSwing: VoidFunction
  private onDie: VoidFunction

  // Sprite specifics
  private sequencer: Sequencer
  private health: number = 15

  /// #if DEBUG
  private debug_health: PIXI.Text
  /// #endif

  constructor({ x, y }: Coordinates, container: PIXI.Container, onSwing?: VoidFunction, onDie?: VoidFunction) {
    // Super constructor
    super("Melee")

    // Store arguments
    this.onSwing = onSwing
    this.onDie = onDie

    // Initialize component
    this.sprite = createSpriteWarrior()
    this.sprite.name = this.UID
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.zIndex = Math.floor(y)
    this.sprite.loop = true
    this.sprite.play()
    container.addChild(this.sprite)

    // Filters
    const lightFilter = new PIXI.ColorMatrixFilter()
    lightFilter.matrix = [ 
      1, 0, 0, 0, 0.15, 
      0, 1, 0, 0, 0.15, 
      0, 0, 1, 0, 0.15, 
      0, 0, 0, 1, 0
    ];

    // Initialize sequencer
    this.sequencer = new Sequencer()

    this.sequencer.repeatSequence("attack_1", [{
      duration: 10,
      callback: () => {
        this.sprite.switch("attack_1")
        this.sprite.play()
      }
    }, {
      duration: 4,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.onSwing()
        soundSlash.play()
      }
    }, {
      duration: 10,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sprite.switch("idle")
        this.sprite.play()
        this.sequencer.pause("attack_1")
      }
    }], true)

    this.sequencer.repeatSequence("attack_2", [{
      duration: 10,
      callback: () => {
        this.sprite.switch("attack_2")
        this.sprite.play()
      }
    }, {
      duration: 4,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.onSwing()
        soundSlash.play()
      }
    }, {
      duration: 10,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sprite.switch("idle")
        this.sprite.play()
        this.sequencer.pause("attack_2")
      }
    }], true)

    this.sequencer.repeatSequence("hurt_and_stun", [{
      duration: 0,
      callback: () => {
        this.sequencer.pause("attack_1")
        this.sequencer.pause("attack_2")
        this.sprite.switch("hurt")
        this.sprite.play()
      }
    },{
      duration: 7,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sequencer.pause("hurt_and_stun")
        this.sprite.switch("idle")
        this.sprite.play()
      }
    }], true)

    this.sequencer.repeatSequence("hurt", [{
      duration: 0,
      callback: () => {
        this.sprite.filters = [lightFilter]
      }
    },{
      duration: 10,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sprite.filters = []
        this.sequencer.pause("hurt")
      }
    }], true)

    this.sequencer.onceSequence("death", [{
      duration: 0,
      callback: () => {
        this.onDie && this.onDie()
        this.sprite.switch("death")
        this.sprite.play()
        this.sprite.loop = false
        soundScream.play()
        // More fun this way
        // this.shouldBeUnmounted = true
        /// #if DEBUG
        collider.visible = false
        this.debug_health.visible = false
        /// #endif
      }
    }, {
      duration: 18,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.shouldBeUnmounted = true
      }
    }], true)

    /// #if DEBUG
    const collider = new PIXI.Graphics()
    collider.lineStyle(2, 0xff0000)
    collider.drawCircle(2, -5, this.getCollisionRegion().radius)
    collider.endFill()
    this.sprite.addChild(collider)
    this.debug_health = new PIXI.Text(`HP:${this.health}`, {
      fontFamily: FONT_FAMILY,
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 5
    })
    this.debug_health.anchor.set(0.5)
    this.debug_health.y -= 40
    this.sprite.addChild(this.debug_health)
    /// #endif
  }
  
  attack() {
    if (this.sequencer.isPaused("attack_1") && this.sequencer.isPaused("attack_2")) {
      this.sequencer.unpause(Math.random() < 0.5 ? "attack_1" : "attack_2")
    }
  }

  hit(damage: number) {
    this.health -= damage
    if (this.health <= 0) {
      if (this.sequencer.isPaused("death")) {
        this.sequencer.pause("attack_1")
        this.sequencer.pause("attack_2")
        this.sequencer.pause("hurt")
        this.sequencer.pause("hurt_and_stun")
        this.sequencer.unpause("death")
      }
    } else {
      if (this.sequencer.isPaused("hurt") && this.sequencer.isPaused("hurt_and_stun")) {
        this.sequencer.unpause(Math.random() < 0.5 ? "hurt" : "hurt_and_stun")
      }
    }

    /// #if DEBUG
    this.debug_health.text = `HP:${this.health}`
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
        x: this.sprite.x + 2,
        y: this.sprite.y - 5,
      },
      radius: 20,
    }
  }
}
