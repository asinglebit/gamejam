import * as PIXI from "pixi.js"

import { Component } from "../../core/component"
import { Sequencer } from "../../core/sequencer"
import { CollisionRegion } from "../../core/collision_region"
import { TimedAnimatedSprite } from "../../core/timed_animated_sprite"
import { createSpriteRanged } from "../../utils/sprites"

export class UnitRanged extends Component {
  private sprite: TimedAnimatedSprite
  private onFireProjectile: VoidFunction = null

  // Sprite specifics
  private sequencer: Sequencer
  private health: number = 4

  /// #if DEBUG
  private debug_health: PIXI.Text
  /// #endif

  constructor({ x, y }: Coordinates, container: PIXI.Container, onFireProjectile?: VoidFunction) {
    // Super constructor
    super("UnitRanged")

    // Store arguments
    this.onFireProjectile = onFireProjectile

    // Initialize component
    this.sprite = createSpriteRanged()
    this.sprite.name = this.UID
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.scale.x = 2
    this.sprite.scale.y = 2
    this.sprite.loop = true
    this.sprite.play()
    container.addChild(this.sprite)

    // Initialize sequencer
    this.sequencer = new Sequencer()

    this.sequencer.repeatSequence("shoot", [{
      duration: 100,
      callback: () => {
        this.sprite.switch("attack")
        this.sprite.play()
      }
    }, {
      duration: 4,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.onFireProjectile()
      }
    }, {
      duration: 10,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sprite.switch("idle")
        this.sprite.play()
      }
    }])

    this.sequencer.repeatSequence("hurt", [{
      duration: 0,
      callback: () => {
        this.sprite.switch("hurt")
        this.sprite.play()
      }
    }, {
      duration: 8,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sequencer.pause("hurt")
        this.sequencer.unpause("shoot")
        this.sequencer.reset("shoot")
        this.sprite.switch("idle")
        this.sprite.play()
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
    this.sprite.addChild(collider)
    this.debug_health = new PIXI.Text(`HP:${this.health}`, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xffffff,
      align: "center",
      strokeThickness: 2,
    })
    this.debug_health.anchor.set(0.5)
    this.debug_health.y -= 40
    this.debug_health.scale.x = 0.5
    this.debug_health.scale.y = 0.5
    this.sprite.addChild(this.debug_health)
    /// #endif
  }

  hit(damage: number) {
    this.health -= damage
    if (this.health <= 0) {
      if (this.sequencer.isPaused("death")) {
        this.sequencer.pause("shoot")
        this.sequencer.pause("hurt")
        this.sequencer.unpause("death")
      }
    } else {
      if (this.sequencer.isPaused("hurt")) {
        this.sequencer.pause("shoot")
        this.sequencer.unpause("hurt")
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
        x: this.sprite.x,
        y: this.sprite.y,
      },
      radius: 10,
    }
  }
}
